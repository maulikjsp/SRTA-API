const { pool } = require("../../config/db");
const createExam = async (req, res) => {
  try {
    const { examname, examcode, start_date, end_date, active } = req.body;

    // Check if the examname or examcode already exists
    const checkQuery = await pool.query(
      "SELECT * FROM exams WHERE examname = $1 OR examcode = $2",
      [examname, examcode]
    );

    if (checkQuery.rows.length > 0) {
      return res.status(400).json({
        message: "Duplicate examname or examcode. Exam creation failed.",
      });
    }

    await pool.query(`INSERT INTO exams (examname, examcode, start_date, end_date, active)
    VALUES ('${examname}', '${examcode}', '${start_date}', '${end_date}', '${active}')`);

    return res.status(200).json({
      message: "Exam created successfully",
    });
  } catch (error) {
    console.error("Error logging in:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

module.exports = createExam;
