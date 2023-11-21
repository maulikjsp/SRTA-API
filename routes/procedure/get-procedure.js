const { pool } = require("../../config/db");

const getProcedure = async (req, res) => {
  try {
    const procedureQuery = await pool.query("SELECT * FROM public.procedures");
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

module.exports = getProcedure;
