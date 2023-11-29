const { pool } = require("../../config/db");

const editQuestionnaires = async (req, res) => {
  try {
    const {
      AcceptableList,
      selectedCategory,
      selectedExamType,
      selectedProcedure,
      selectedSection,
      title,
      id,
    } = req.body;

    const category_id = selectedCategory?.id;
    const exam_type_id = selectedExamType?.id;
    const procedure_id = selectedProcedure?.id;
    const section_id = selectedSection?.id;

    // Check if the questionnaires title already exists
    const checkQuery = await pool.query(
      "SELECT * FROM questionnaires WHERE title = $1 AND id != $2",
      [title, id]
    );
    if (checkQuery.rows.length > 0) {
      return res.status(400).json({
        message: "Questionnaires already exists with given title",
      });
    }

    const updateQuestionnairesQuery = await pool.query(
      `
        UPDATE questionnaires 
        SET category_id = $1, exam_type_id = $2, procedure_id = $3, section_id = $4, title = $5 
        WHERE id = $6
        `,
      [category_id, exam_type_id, procedure_id, section_id, title, id]
    );

    if (id != undefined) {
      for (let i = 0; i < AcceptableList.length; i++) {
        if (AcceptableList[i]["id"] != undefined) {
          // If the ID exists, update the existing record
          const query = `
              UPDATE criterias 
              SET is_acceptable = $1, title = $3 
              WHERE id = $2
            `;
          const values = [
            AcceptableList[i]["acceptable"] ? 1 : 0,
            AcceptableList[i]["id"],
            AcceptableList[i]["Acceptable"],
          ];
          try {
            await pool.query(query, values);
          } catch (error) {
            // Handle any errors that may occur during the database query
            console.error(`Error updating row ${i + 1}:`, error);
          }
        } else {
          // If the ID does not exist, it's a new item, so insert it
          const insertQuery = `
              INSERT INTO criterias (is_acceptable, questionnaire_id, title) VALUES ($1, $2, $3)
            `;
          const insertValues = [
            AcceptableList[i]["acceptable"] ? 1 : 0,
            id,
            AcceptableList[i]["Acceptable"],
          ];
          try {
            await pool.query(insertQuery, insertValues);
          } catch (error) {
            // Handle any errors that may occur during the database query
            console.error(`Error inserting new row ${i + 1}:`, error);
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
