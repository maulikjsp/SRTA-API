const { pool, poolUat } = require("../../config/db");

const getExamData = async (req, res) => {
  try {
    const examDataQuery = await poolUat.query(`SELECT 
    "Exams"."SiteCode",
    "Exams"."Id",
    "Exams"."EventDate", 
    "Exams"."ApplicationDeadline", 
    "Exams"."IsClosedSite", 
    "ExamFacilities"."Name", 
    "ExamFacilities"."Address1",
    "ExamFacilities"."City",
    "ExamFacilities"."State",
    "ExamFacilities"."Zip",
    "Exams"."ExamStatusId",
    "ExamSections"."ScheduleName",
    "ExamSections"."ExamSectionTypeId",
    "ExamSectionTypes"."Name"
  FROM public."Exams"
  INNER JOIN public."ExamFacilities" ON public."Exams"."ExamFacilityId" = public."ExamFacilities"."Id"
  INNER JOIN public."ExamSections" ON public."Exams"."Id" = public."ExamSections"."ExamId"
  INNER JOIN public."ExamSectionTypes" ON public."ExamSections"."Id" = public."ExamSections"."Id"`);
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
