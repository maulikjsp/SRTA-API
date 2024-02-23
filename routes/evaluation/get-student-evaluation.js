const { pool } = require("../../config/db");

const getCallBoardStatus = async (req, res) => {
  try {
    const callBoardQuery = await pool.query(`
       SELECT * FROM get_students_with_exam_status_and_examiner_name()
       `);
    return res.status(201).json({
      data: callBoardQuery.rows,
    });
  } catch (error) {
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

module.exports = getCallBoardStatus;
