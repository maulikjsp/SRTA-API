const { pool } = require("../../config/db");

const completeExamProcedureStatus = async (req, res) => {
  try {
    const { procedure_id, student_id } = req.body;
    await pool.query(
      `UPDATE exam_procedure_status SET status = 'Completed' WHERE procedure_id =$1 AND student_id =$2`,
      [procedure_id, student_id]
    );
    return res.status(200).json({ message: "procedure status updated" });
  } catch (error) {
    return res.status(500).json({ message: "Server error" });
  }
};

module.exports = completeExamProcedureStatus;
