const { pool } = require("../../config/db");

const statusChangeExam = async (req, res) => {
  try {
    const id = req.params.id;
    await pool.query(
      `
      UPDATE exams
  SET active = CASE
    WHEN id = $1 THEN TRUE
    ELSE FALSE
  END
      `,
      [id]
    );
    return res.status(201).json({
      message: "Exam status changed successfully",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

module.exports = statusChangeExam;
