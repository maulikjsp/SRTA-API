const { pool } = require("../../config/db");

const getSectionsStudent = async (req, res) => {
  try {
    const id = req.params.id;
    const studentQuery = await pool.query(
      `
    SELECT 
  "students"."name",
  "students"."id",
  "sections"."id" AS "Section_id"
FROM 
  "students"
  INNER JOIN "exams" ON "exams"."id" = "students"."exam_id"
  INNER JOIN "exam_sections" ON "exam_sections"."exam_id" = "exams"."id"
  INNER JOIN "sections" ON "sections"."id" = "exam_sections"."section_id"
WHERE 
  "sections"."id" = $1;
  `,
      [id]
    );
    const queryData = studentQuery.rows;
    return res.status(201).json({
      students: queryData,
    });
  } catch (error) {
    return res.status(500).json({ message: "Server error" });
  }
};

module.exports = getSectionsStudent;
