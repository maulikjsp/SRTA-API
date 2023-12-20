const { pool } = require("../../config/db");

const getQuestionairesByProcedureId = async (req, res) => {
  try {
    const id = req.params.id;
    const questionnairesQuery = await pool.query(
      `
      SELECT "questionnaires"."title" as "queationnaires_title",
      "questionnaires"."procedure_id",
      "questionnaires"."id" as "questionnaires_id",
      "questionnaires"."section_id"
      FROM questionnaires
      WHERE procedure_id = $1
      `,
      [id]
    );

    const queryData = questionnairesQuery.rows;
    let questionnaires = [];

    for (let i = 0; i < queryData.length; i++) {
      const criteriaQuery = await pool.query(
        `
          SELECT "criterias"."title",
          "criterias"."is_acceptable",
          "criterias"."criterias_index"
          FROM criterias
          WHERE questionnaire_id = $1 
        `,
        [queryData[i]?.questionnaires_id]
      );

      // Use push to add new items to the array
      questionnaires.push({
        questionnaires_title: queryData[i]?.queationnaires_title, // Corrected typo
        criteria: criteriaQuery.rows,
        questionnaires_id: queryData[i]?.questionnaires_id,
      });
    }

    return res.status(201).json({
      questionnaires: questionnaires,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Internal Server Error",
    });
  }
};

module.exports = getQuestionairesByProcedureId;
