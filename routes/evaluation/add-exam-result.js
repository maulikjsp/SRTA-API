const { pool } = require("../../config/db");
const addExamResult = async (req, res) => {
  try {
    const { examiner_id, student_id, procedure_id, questionnaires_id, criteria_ans, criteria_id } =
      req.body;
    await pool.query(
      `
    INSERT INTO exam_submission (examiner_id, student_id, procedure_id, questionnaires_id, criteria_ans, criteria_id)
VALUES ($1, $2 , $3, $4, $5, $6) 
    `,
      [examiner_id, student_id, procedure_id, questionnaires_id, criteria_ans, criteria_id]
    );
    return res.status(201).json({
      message: "Questionnaires answers saved",
    });
  } catch (error) {
    return res.status(500).json({
      message: "Internal Server Error",
    });
  }
};

module.exports = addExamResult;
