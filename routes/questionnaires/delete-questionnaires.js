const { pool } = require("../../config/db");

const deleteQuestionnaires = async (req, res) => {
  try {
    const id = req.params.id;
    await pool.query(`DELETE FROM questionnaires WHERE id = $1`, [id]);
    await pool.query(`DELETE FROM criterias WHERE questionnaire_id = $1`, [id]);

    return res.status(201).json({ message: "Questionnaires deleted successfully" });
  } catch (error) {
    return res.status(500).json({ message: "Internal Server", error: error });
  }
};

module.exports = deleteQuestionnaires;
