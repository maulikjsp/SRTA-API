const { pool } = require("../../config/db");

const getUnmatchedCriteria = async (req, res) => {
  try {
    const { procedure_id, student_id } = req.body;
    const escalatedQuery = await pool.query(`SELECT * FROM get_unmatched_criteria_list($1, $2)`, [
      procedure_id,
      student_id,
    ]);
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
