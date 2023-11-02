const { pool, poolUat } = require("../../config/db");

const getExamSections = async (req, res) => {
  const { id, date } = req.params;
  try {
    const examDataQuery = await poolUat.query(
      `SELECT "ExamSections"."ScheduleName", "ExamSections"."Id", "ExamSections"."ExamSectionTypeId",
      "ExamSections"."ExamId", "ExamSectionTypes"."Name"
        FROM public."ExamSections"
        INNER JOIN public."ExamSectionTypes" ON "ExamSections"."ExamSectionTypeId" = "ExamSectionTypes"."Id"
        WHERE "ExamSections"."ExamId" = $1 AND "ExamSections"."ExamDate" = $2;
      `,
      [id, date]
    );
    const examData = examDataQuery.rows;
    return res.status(200).json({
      examSections: examData,
    });
  } catch (error) {
    console.log(error, "error");
    return res.status(500).json({ message: "Internal Server error" });
  }
};
module.exports = getExamSections;
