const { pool } = require("../../config/db");

const getUnmatchedCriteria = async (req, res) => {
  try {
    const { procedure_id, student_id } = req.body;
    const escalatedQuery = await pool.query(
      `SELECT
    es.id,
    es.procedure_id,
    es.student_id,
    es.criteria_id,
    es.criteria_ans,
    es.examiner_id,
    es.questionnaires_id,
    c.title,
    u.name
FROM
    exam_submission es
JOIN criterias c ON es.criteria_id = c.id
JOIN users u ON es.examiner_id  = u.id
WHERE
    es.procedure_id = $1
    AND es.student_id = $2
    AND NOT EXISTS (
        SELECT 1
        FROM exam_submission es2
        WHERE es2.procedure_id = $1
          AND es2.student_id = $2
          AND es2.criteria_id = es.criteria_id
          AND es2.criteria_ans = es.criteria_ans
          AND es2.id <> es.id
    );`,
      [procedure_id, student_id]
    );
    return res.status(201).json({
      criteria: escalatedQuery.rows,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Internal Server Error",
    });
  }
};

module.exports = getUnmatchedCriteria;
