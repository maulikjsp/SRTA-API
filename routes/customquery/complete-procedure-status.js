const { pool } = require("../../config/db");

const completeExamProcedureStatus = async (req, res) => {
  try {
    const { procedure_id, student_id, examiner_id, questionnaires_id, questionnaires } = req.body;
    const questionnairesCriteria = JSON.parse(questionnaires);

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
      questionnairesCriteria?.map(async (item, index) => {
        const result = await pool.query("SELECT check_student_status($1, $2, $3) AS status", [
          procedure_id,
          student_id,
          item?.id,
        ]);
        return result.rows[0]["status"];
      })
    );

    const completedCount =
      statuses.filter((status) => status === "completed").length === statuses.length ||
      statuses.length - 1;

    const updateStatusQuery = `
      UPDATE exam_procedure_status
      SET status = $1, examiner_id = $2
      WHERE procedureid = $3 AND student_id = $4
    `;

    const insertSubmissionQuery = `
      INSERT INTO procedure_submission (student_id, examiner_id, procedure_id, questionnaires, escalated )
      VALUES ($1, $2, $3, $4, $5)
    `;

    const escalated = statuses.filter((status) => status === "escalated").length >= 1;

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
      escalated,
    ]);

    return res.status(200).json({
      message: "Procedure status updated",
    });
  } catch (error) {
    console.log(error, "Error");
    return res.status(500).json({ message: "Server error" });
  }
};

module.exports = completeExamProcedureStatus;
