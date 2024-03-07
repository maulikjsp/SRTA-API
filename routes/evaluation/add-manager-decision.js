const { pool } = require("../../config/db");

const submitMangerDecision = async (req, res) => {
  try {
    const { manager_id, exam_procedure_id } = req.body;

    const queryMap = await Promise.all(
      data?.questionnaires?.map(async (item, index) => {
        const result = await pool.query(
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
            item?.procedure_id,
            item?.student_id,
            manager_id,
            item?.criteria_id,
            item?.questionnaires_id,
            { title: item?.title, ans: item?.ans },
            exam_procedure_id,
            item?.ans,
          ]
        );
        return result.rows[0];
      })
    );

    if (
      data?.questionnaires?.filter((item) => item?.ans === true).length ===
      data?.questionnaires?.length
    ) {
      const updateStatusQuery = `
      UPDATE exam_procedure_status
      SET status = $1, escalated = $3
      WHERE id = $2
    `;
      await pool.query(updateStatusQuery, ["completed", exam_procedure_id, false]);
    } else {
      const updateStatusQuery = `
      UPDATE exam_procedure_status
      SET status = $1, escalated = $3
      WHERE id = $2
    `;
      await pool.query(updateStatusQuery, ["pending", exam_procedure_id, false]);
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
