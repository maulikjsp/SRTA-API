const { pool } = require("../../config/db");
const addExamResult = async (req, res) => {
  try {
    const { examiner_id, student_id, procedure_id, questionnaires_id, questionnaires_ans } =
      req.body;
    await pool.query(
      `
    INSERT INTO exam_results (examiner_id, student_id, procedure_id, questionnaires_id, questionnaires_ans)
VALUES ($1, $2 , $3, $4, $5) 
    `,
      [examiner_id, student_id, procedure_id, questionnaires_id, questionnaires_ans]
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
