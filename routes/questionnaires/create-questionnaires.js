const { pool } = require("../../config/db");

const createQuestionnaires = async (req, res) => {
  try {
    // const { category_id, exam_type_id, procedure_id, section_id, title } = req.body;
    const {
      AcceptableList,
      selectedCategory,
      selectedExamType,
      selectedProcedure,
      selectedSection,
      title,
    } = req.body;

    const category_id = selectedCategory?.id;
    const exam_type_id = selectedExamType?.id;
    const procedure_id = selectedProcedure?.id;
    const section_id = selectedSection?.id;

    // Check if the examname or examcode already exists
    // const checkQuery = await pool.query("SELECT * FROM questionnaires WHERE title = $1", [title]);
    // if (checkQuery.rows.length > 0) {
    //   return res.status(400).json({
    //     message: "Questionnaires already exists with given title",
    //   });
    // }

    const createQuestionnairesQuery = await pool.query(
      "INSERT INTO questionnaires (category_id, exam_type_id, procedure_id, section_id) VALUES($1, $2, $3, $4)RETURNING id",
      [category_id, exam_type_id, procedure_id, section_id]
    );

    const QuestionnairesId = createQuestionnairesQuery.rows[0]?.id;
    if (QuestionnairesId != undefined) {
      for (let i = 0; i < AcceptableList.length; i++) {
        const query = `INSERT INTO criterias (points, questionnaire_id, title, criterias_index) VALUES ($1, $2, $3, $4)`;
        const values = [
          AcceptableList[i]["points"],
          QuestionnairesId,
          AcceptableList[i]["Acceptable"],
          AcceptableList[i]["index"],
        ];
        try {
          await pool.query(query, values);
        } catch (error) {
          // Handle any errors that may occur during the database query
          console.error(`Error inserting row ${i + 1}:`, error);
        }
      }
    }
    return res.status(201).json({
      message: "Questionnaires created successfully",
    });
  } catch (error) {
    console.log(error, "error");
    res.status(500).json({
      message: "Internal Server Error",
      error: error,
    });
  }
};

module.exports = createQuestionnaires;
