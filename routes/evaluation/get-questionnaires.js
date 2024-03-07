const { pool } = require("../../config/db");

const getQuestionairesByProcedureId = async (req, res) => {
  try {
    const id = req.params.id;
    const questionnairesQuery = await pool.query(
      `
      SELECT 
      "questionnaires"."procedure_id",
      "questionnaires"."id" as "questionnaires_id",
      "questionnaires"."section_id",
      "procedures"."title" AS "procedure",
      "categories"."title" AS "scoring_criteria"
      FROM questionnaires
      INNER JOIN procedures on "procedures"."id" = "questionnaires"."procedure_id"
      INNER JOIN categories on "categories"."id" = "questionnaires"."category_id"
      WHERE "questionnaires"."procedure_id" = $1
      `,
      [id]
    );

    const queryData = questionnairesQuery.rows;
    let questionnaires = [];

    for (let i = 0; i < queryData.length; i++) {
      const criteriaQuery = await pool.query(
        `
          SELECT "criterias"."title",          
          "criterias"."criterias_index",
          "criterias"."id"
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
        procedure: queryData[i]?.procedure,
        scoring_criteria: queryData[i]?.scoring_criteria,
      });
    }
    if (questionnaires.length === 0) {
      return res.status(400).json({
        message: "No Questionnaires Found for this Procedure. Please Create Questionnaires First",
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
