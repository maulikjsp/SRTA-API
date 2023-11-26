const { pool } = require("../../config/db");

const getExamTypes = async (req, res) => {
  try {
    const ExamTypesQuery = await pool.query(`SELECT * FROM examtypes`);
    const ExamTypeData = ExamTypesQuery.rows;
    return res.status(200).json({
      examTypes: ExamTypeData,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Internal Server error",
    });
  }
};

module.exports = getExamTypes;
