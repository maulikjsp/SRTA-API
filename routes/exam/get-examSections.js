const { pool, poolUat } = require("../../config/db");

const getExamSections = async (req, res) => {
  const { id, date } = req.params;
  try {
    const examDataQuery = await poolUat.query(
      `SELECT "ExamSections"."ScheduleName", "ExamSections"."Id", "ExamSections"."ExamSectionTypeId",
      "ExamSections"."ExamId", "ExamSectionTypes"."Name", "ExamSectionTypes"."Id"
        FROM public."ExamSections"
        INNER JOIN public."ExamSectionTypes" ON "ExamSections"."ExamSectionTypeId" = "ExamSectionTypes"."Id"
        WHERE "ExamSections"."ExamId" = $1 AND "ExamSections"."ExamDate" = $2;
      `,
      [id, date]
    );

    const examStudentsQuery = await poolUat.query(
      `
        SELECT 
            "CandidateExams"."CandidateProfileId",
            "CandidateExams"."CandidateExamSeqNum",
            "CandidateProfiles"."UserId",
            "CandidateProfiles"."SocialSecurity",
            "CandidateProfiles"."StreetAddress",
            "CandidateProfiles"."City",
            "CandidateProfiles"."GraduationDate",
            "AbpUsers"."Name" AS "student_name",
            "AbpUsers"."Surname" AS "student_surname",
            "AbpUsers"."EmailAddress",
            "AbpUsers"."PhoneNumber",
            "Schools"."Name" AS "school"
            FROM public."CandidateExams"
            INNER JOIN public."CandidateProfiles" ON "CandidateExams"."CandidateProfileId" = "CandidateProfiles"."Id"
            INNER JOIN public."AbpUsers" ON "CandidateProfiles"."UserId" = "AbpUsers"."Id"
            INNER JOIN public."Schools" ON "CandidateProfiles"."GraduationSchoolId" = "Schools"."Id"
            WHERE "CandidateExams"."ExamId" = $1 
            AND "CandidateExams"."IsDeleted" = 'f' AND "CandidateProfiles"."IsDeleted" = 'f' AND "CandidateProfiles"."IsDeleted" = 'f'
            `,
      [id]
    );
    const examData = examDataQuery.rows;
    const examStudentsData = examStudentsQuery.rows;

    return res.status(200).json({
      examStudents: examStudentsData,
      examSections: examData,
    });
  } catch (error) {
    console.log(error, "error");
    return res.status(500).json({ message: "Internal Server error" });
  }
};
module.exports = getExamSections;
