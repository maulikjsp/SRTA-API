const { pool } = require("../../config/db");

const completeExamProcedureStatus = async (req, res) => {
  try {
    const { procedure_id, student_id, examiner_id } = req.body;

    //     const getExaminer = await pool.query(`
    //     SELECT DISTINCT
    //        "exam_submission"."examiner_id"
    // from exam_submission `);

    //     const getCriteriaAnsQuery = await pool.query(
    //       `
    //         SELECT DISTINCT  "exam_submission"."procedure_id",
    //        "exam_submission"."criteria_id",
    //        "exam_submission"."criteria_ans"
    // from exam_submission WHERE examiner_id = $1 AND procedure_id = $2 AND student_id = $3
    //           `,
    //       [examiner_id, procedure_id, student_id]
    //     );

    const statusUpdateQuery = await pool.query(
      `UPDATE exam_procedure_status SET status = 'pending', submi WHERE procedure_id =$1 AND student_id =$2`,
      [procedure_id, student_id]
    );
    return res
      .status(200)
      .json({ message: "procedure status updated", response: procedureStatus.rows });
  } catch (error) {
    return res.status(500).json({ message: "Server error" });
  }
};

module.exports = completeExamProcedureStatus;
