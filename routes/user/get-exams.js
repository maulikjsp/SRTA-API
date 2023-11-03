const { pool } = require("../../config/db");
const getExams = async (req, res) => {
  try {
    const getExamsQuery = await pool.query("SELECT * FROM exams");
    const exams = getExamsQuery.rows;

    // Create an array of promises for fetching users for each exam
    const examDataWithUsersPromises = exams.map(async (item) => {
      const usersQuery = await pool.query('SELECT * FROM "exam_user" WHERE "exam_id" = $1', [
        item.id,
      ]);
      const examSectionQuery = await pool.query(
        `
        select 
       "sections"."title",
       "sections"."id",
       "groups"."title" as Group
        from "sections"
        inner join "exam_sections" on "exam_sections"."section_id" = "sections"."id"
        inner join "groups" on "groups"."exam_section_id" = "sections"."id"
        where "exam_id" = $1
      `,
        [item.id]
      );

      const examStudentsQuery = await pool.query('SELECT * FROM "students" WHERE "exam_id" = $1', [
        item.id,
      ]);
      (item.users = usersQuery.rows),
        (item.sections = examSectionQuery.rows),
        (item.students = examStudentsQuery.rows);
      return item;
    });

    // Wait for all the promises to resolve
    const examDataWithUsers = await Promise.all(examDataWithUsersPromises);

    return res.status(200).json({
      exams: examDataWithUsers,
    });
  } catch (error) {
    console.error("Error logging in:", error);
    return res.status(500).json({ message: "Server error" });
  }
};
module.exports = getExams;
