const { pool } = require("../../config/db");
const addExamResult = async (req, res) => {
  try {
    const {
      examiner_id,
      student_id,
      procedure_id,
      questionnaires_id,
      criteria_ans,
      criteria_id,
      title,
    } = req.body;

    const checkQuery = await pool.query(
      `SELECT * FROM exam_submission WHERE student_id = $1 AND criteria_id = $2 AND questionnaires_id = $3 AND examiner_id = $4`,
      [student_id, criteria_id, questionnaires_id, examiner_id]
    );

    if (checkQuery?.rows.length > 0) {
      await pool.query(
        `
        UPDATE exam_submission
        SET criteria_ans = $1, examiner_id = $2, title = $4
        WHERE criteria_id = $3
        `,
        [criteria_ans, examiner_id, criteria_id, title]
      );
      return res.status(201).json({
        message: "Questionnaires answers saved",
      });
    } else {
      await pool.query(
        `
        INSERT INTO exam_submission (examiner_id, student_id, procedure_id, questionnaires_id, criteria_ans, criteria_id)
        VALUES ($1, $2 , $3, $4, $5, $6, $7) 
        `,
        [examiner_id, student_id, procedure_id, questionnaires_id, criteria_ans, criteria_id, title]
      );
      return res.status(201).json({
        message: "Questionnaires answers saved",
      });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      error: error,
      message: "Internal Server Error",
    });
  }
};

module.exports = addExamResult;
