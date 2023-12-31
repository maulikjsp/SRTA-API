const { pool } = require("../../config/db");

const editQuestionnaires = async (req, res) => {
  try {
    const {
      AcceptableList,
      selectedCategory,
      selectedExamType,
      selectedProcedure,
      selectedSection,
      id,
    } = req.body;

    const category_id = selectedCategory?.id;
    const exam_type_id = selectedExamType?.id;
    const procedure_id = selectedProcedure?.id;
    const section_id = selectedSection?.id;

    // Check if the questionnaires title already exists
    // const checkQuery = await pool.query(
    //   "SELECT * FROM questionnaires WHERE title = $1 AND id != $2",
    //   [title, id]
    // );
    // if (checkQuery.rows.length > 0) {
    //   return res.status(400).json({
    //     message: "Questionnaires already exists with given title",
    //   });
    // }

    const updateQuestionnairesQuery = await pool.query(
      `
        UPDATE questionnaires 
        SET category_id = $1, exam_type_id = $2, procedure_id = $3, section_id = $4
        WHERE id = $5
        `,
      [category_id, exam_type_id, procedure_id, section_id, id]
    );

    if (id != undefined) {
      await pool.query(`DELETE FROM criterias WHERE questionnaire_id = $1`, [id]);
      if (id != undefined) {
        for (let i = 0; i < AcceptableList.length; i++) {
          const query = `INSERT INTO criterias (points, questionnaire_id, title, criterias_index) VALUES ($1, $2, $3, $4)`;
          const values = [
            AcceptableList[i]["points"],
            id,
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
    }

    return res.status(201).json({
      message: "Questionnaires updated successfully",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Internal Server Error",
      error: error,
    });
  }
};
module.exports = editQuestionnaires;
