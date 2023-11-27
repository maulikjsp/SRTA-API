const { pool } = require("../../config/db");

const getCriterias = async (req, res) => {
  try {
    const criteriasQuery = await pool.query("SELECT * FROM criterias");
    const criteriasData = criteriasQuery.rows;

    return res.status(201).json({
      criterias: criteriasData,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Internal Server Error",
    });
  }
};

module.exports = getCriterias;
