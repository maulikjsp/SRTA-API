const { pool } = require("../../config/db");

const completeExamProcedureStatus = async (req, res) => {
  try {
    const { procedure_id, student_id, examiner_id, questionnaires_id, questionnaires } = req.body;

    // Check if examiner has already submitted for the given procedure and student
    const existingSubmission = await pool.query(
      "SELECT * FROM procedure_submission WHERE procedure_id = $1 AND student_id = $2 AND examiner_id = $3",
      [procedure_id, student_id, examiner_id]
    );

    // if (existingSubmission.rows.length > 0) {
    //   return res
    //     .status(400)
    //     .json({ message: "Examiner has already submitted for this procedure and student." });
    // }

    const statuses = await Promise.all(
      questionnaires_id?.map(async (questionnaire_id) => {
        const result = await pool.query("SELECT check_criteria_status($1, $2, $3, $4) AS status", [
          procedure_id,
          questionnaire_id,
          examiner_id,
          student_id,
        ]);
        return result.rows[0]["status"];
      })
    );

    const completedCount =
      statuses.filter((status) => status === "completed").length === questionnaires_id.length;

    const updateStatusQuery = `
      UPDATE exam_procedure_status
      SET status = $1, examiner_id = $2
      WHERE procedureid = $3 AND student_id = $4
    `;

    const insertSubmissionQuery = `
      INSERT INTO procedure_submission (student_id, examiner_id, procedure_id, questionnaires)
      VALUES ($1, $2, $3, $4)
    `;

    await pool.query(updateStatusQuery, [
      completedCount ? "completed" : "pending",
      examiner_id,
      procedure_id,
      student_id,
    ]);

    await pool.query(insertSubmissionQuery, [
      student_id,
      examiner_id,
      procedure_id,
      questionnaires,
    ]);

    return res.status(200).json({ message: "Procedure status updated", statuses: completedCount });
  } catch (error) {
    console.log(error, "Error");
    return res.status(500).json({ message: "Server error" });
  }
};

module.exports = completeExamProcedureStatus;
