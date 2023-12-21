const { pool } = require("../../config/db");

const updateExamProcedureStatus = async (req, res) => {
  try {
    const { procedure_id, student_id, status } = req.body;
    await pool.query(
      `UPDATE exam_procedure_status SET status =$1 WHERE procedure_id =$2 AND student_id =$3`,
      [status, procedure_id, student_id]
    );
    return res.status(200).json({ message: "procedure status updated" });
  } catch (error) {
    return res.status(500).json({ message: "Server error" });
  }
};

module.exports = updateExamProcedureStatus;
