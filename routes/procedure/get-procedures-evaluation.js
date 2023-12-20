const { pool } = require("../../config/db");

const getProcedureOfEvaluation = async (req, res) => {
  try {
    const procedureQuery = await pool.query(`SELECT DISTINCT procedures.*
    FROM procedures
    JOIN questionnaires ON procedures.id = questionnaires.procedure_id;
     `);
    const procedure = procedureQuery.rows;
    return res.status(201).json({
      procedure: procedure,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Internal Server Error",
    });
  }
};

module.exports = getProcedureOfEvaluation;
