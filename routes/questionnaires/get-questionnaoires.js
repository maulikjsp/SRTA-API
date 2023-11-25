const { pool } = require("../../config/db");

const getQuestionnaires = async (req, res) => {
  try {
    const questionnairesQuery = await pool.query("SELECT * FROM questionnaires");
    const questionnairesData = questionnairesQuery.rows;
    return res.status(200).json({ questionnaires: questionnairesData });
  } catch (error) {
    return res.status(500).json({ message: "Internal Server Error", error: error });
  }
};

module.exports = getQuestionnaires;
