const { pool } = require("../../config/db");

const deleteExamProcedure = async (req, res) => {
  try {
    const id = req.params.id;
    const getExmProcedure = await pool.query("SELECT * FROM exam_procedure_status WHERE id=$1", [
      id,
    ]);
    const examProcedureData = getExmProcedure.rows;
    // Check if the exam procedure exists or not
    await pool.query("DELETE FROM exam_procedure_status WHERE id=$1", [id]);
    await pool.query("DELETE FROM procedure_submission WHERE student_id=$1 AND procedure_id=$2", [
      examProcedureData?.student_id,
      examProcedureData?.procedureid,
    ]);

    return res.status(200).json({
      message: "Procedure Deleted successfully",
    });
  } catch (error) {
    return res.status(500).json({
      message: "Server error",
    });
  }
};

module.exports = deleteExamProcedure;
