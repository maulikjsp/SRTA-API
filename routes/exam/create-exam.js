const { pool } = require("../../config/db");

function validateData(data) {
  if (
    !data.examname ||
    !data.examcode ||
    !data.start_date ||
    !data.end_date ||
    data.type === undefined ||
    !data.facility_name ||
    !data.state ||
    !data.zip ||
    !data.address
  ) {
    return false;
  }
  return true;
}
const createExam = async (req, res) => {
  try {
    const {
      examname,
      examcode,
      start_date,
      end_date,
      active,
      type,
      facility_name,
      state,
      zip,
      address,
    } = req.body;

    const created_at = new Date();
    const updated_at = new Date();

    // Validate data before insertion
    if (!validateData(req.body)) {
      return res.status(400).json({ error: "Invalid data. All fields are required." });
    }

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

    // Use parameterized query to insert data and set time zone to UTC
    await pool.query(
      `INSERT INTO exams (examname, examcode, start_date, end_date, active, type, facility_name, state, zip, address, created_at, updated_at)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)`,
      [
        examname,
        examcode,
        start_date,
        end_date,
        active,
        type,
        facility_name,
        state,
        zip,  
        address,
        created_at,
        updated_at,
      ]
    );

    return res.status(200).json({
      message: "Exam created successfully",
    });
  } catch (error) {
    console.error("Error logging in:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

module.exports = createExam;
