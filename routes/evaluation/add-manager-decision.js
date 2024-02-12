const { pool } = require("../../config/db");

const submitMangerDecision = async (req, res) => {
  try {
    const {
      procedure_id,
      student_id,
      manager_id,
      criteria_id,
      questionnaires_id,
      questionnaires,
      exam_procedure_id,
      manager_decision,
    } = req.body;

    await pool.query(
      `
    INSERT INTO manager_decision (
      procedure_id,
      student_id,
      manager_id,
      criteria_id,
      questionnaires_id,
      questionnaires,
      exam_procedure_id,
      manager_decision
  ) VALUES (
      $1, $2, $3, $4, $5, $6, $7, $8
  ) RETURNING *;
    `,
      [
        procedure_id,
        student_id,
        manager_id,
        criteria_id,
        questionnaires_id,
        questionnaires,
        exam_procedure_id,
        manager_decision,
      ]
    );
    if (manager_decision) {
      const updateStatusQuery = `
      UPDATE exam_procedure_status
      SET status = $1, escalated = $3
      WHERE id = $2
    `;
      await pool.query(updateStatusQuery, ["completed", exam_procedure_id, false]);
    }
    return res.status(201).json({
      message: "Questionnaires Submitted successfully",
    });
  } catch (error) {
    console.log(error, "error");
    return res.status(500).json({ message: "Server error" });
  }
};

module.exports = submitMangerDecision;
