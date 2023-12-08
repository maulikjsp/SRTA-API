const { pool } = require("../../config/db");

const deleteExamProcedure = async (req, res) => {
  try {
    const id = req.params.id;

    // Check if the exam procedure exists or not
    await pool.query("DELETE FROM exam_procedure_status WHERE id=$1", [id]);
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
