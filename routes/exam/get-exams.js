const { pool, poolUat } = require("../../config/db");

const getExamData = async (req, res) => {
  try {
    const examDataQuery = await poolUat.query(`SELECT * FROM public."Exams"
    ORDER BY "Id" ASC `);
    const examData = examDataQuery.rows;
    return res.status(200).json({
      exams: examData,
    });
  } catch (error) {
    console.log(error, "error");
    return res.status(500).json({ message: "Internal Server error" });
  }
};
module.exports = getExamData;
