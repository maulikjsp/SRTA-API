const { pool } = require("../../config/db");

const getEvaluatorStatus = async (req, res) => {
  try {
    const { student_id, examiner_id, procedure_id } = req.body;

    const getEvaluatorStatus = await pool.query(
      `SELECT EXISTS (
        SELECT 1
        FROM procedure_submission
        WHERE examiner_id = $1  AND student_id = $2 AND procedure_id = $3
    ) AS result`,
      [examiner_id, student_id, procedure_id]
    );
    const status = getEvaluatorStatus.rows[0]["result"];

    return res.status(201).json({
      status: status,
    });
  } catch (error) {
    console.log(error);

    return res.status(500).json({
      error: error,
      message: "Internal Server Error",
    });
  }
};

module.exports = getEvaluatorStatus;
