const { pool } = require("../../config/db");

const getSections = async (req, res) => {
  try {
    const sectionQuery = await pool.query(`
    select 
"sections"."id",
"sections"."title"
from exams
inner join exam_sections on "exam_sections"."exam_id" = "exams"."id"
inner join sections on "sections"."id" = "exam_sections"."section_id"
WHERE "exams"."active" = true
    `);

    const sectionsData = sectionQuery.rows;

    return res.status(200).json({
      sections: sectionsData,
    });
  } catch (error) {
    return res.status(500).json({ message: "Internal Server error" });
  }
};

module.exports = getSections;
