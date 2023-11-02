const { pool, poolUat } = require("../../config/db");

const getExamStudents = async (req, res) => {
  const { id } = req.params;
  try {
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
            "AbpUsers"."EmailAddress",
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
    const examStudentsData = examStudentsQuery.rows;
    return res.status(200).json({
      examStudents: examStudentsData,
    });
  } catch (error) {
    console.log(error, "error");
    return res.status(500).json({ message: "Internal Server error" });
  }
};
module.exports = getExamStudents;
