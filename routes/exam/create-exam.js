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
    const { selectedRow, roledata } = req.body;
    const {
      SiteCode,
      examcode,
      EventDate,
      ApplicationDeadline,
      active,
      type,
      ExamFacilityId,
      State,
      Zip,
      Address1,
      id,
    } = selectedRow;
    const created_at = new Date();
    const updated_at = new Date();

    // Validate data before insertion
    // if (!validateData(req.body)) {
    //   return res.status(400).json({ error: "Invalid data. All fields are required." });
    // }

    //  get role id from data

    // Check if the examname or examcode already exists
    const checkQuery = await pool.query("SELECT * FROM exams WHERE examname = $1", [SiteCode]);

    if (checkQuery.rows.length > 0) {
      return res.status(400).json({
        message: "Duplicate examname or examcode. Exam creation failed.",
      });
    }

    let examCreationSuccess = false;
    let createdExamId = null;

    try {
      const exam = await pool.query(
        `INSERT INTO exams (examname, examcode, start_date, end_date, active, type, facility_name, state, zip, address, created_at, updated_at, ext_exam_id)
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13) RETURNING id`, // Added RETURNING id to get the inserted ID
        [
          SiteCode,
          SiteCode,
          EventDate,
          ApplicationDeadline,
          active,
          type,
          ExamFacilityId,
          State,
          Zip,
          Address1,
          created_at,
          updated_at,
          id,
        ]
      );

      // Access the created exam's ID from the result
      createdExamId = exam.rows[0]?.id;
      console.log("createdExamId", createdExamId);

      if (createdExamId !== undefined) {
        examCreationSuccess = true;
        console.log("Exam created successfully.");
      } else {
        console.error("Exam creation failed.");
      }
    } catch (error) {
      // Handle any errors that may occur during the first query (exam insertion)
      console.error("Error inserting exam:", error);
    }

    // Insert Exam User into the table if exam creation was successful
    if (roledata && roledata.length && createdExamId !== undefined) {
      for (let i = 0; i < roledata.length; i++) {
        const query = `
          INSERT INTO exam_user (created_at, exam_id, type, updated_at, user_id)
          VALUES
          ($1, $2, $3, $4, $5)
        `;

        const values = [created_at, createdExamId, type, updated_at, roledata[i]];

        try {
          await pool.query(query, values);
        } catch (error) {
          // Handle any errors that may occur during the database query
          console.error(`Error inserting row ${i + 1}:`, error);
        }
      }
    } else {
      console.error("roledata is undefined or empty.");
    }

    return res.status(200).json({
      message: "Exam created successfully",
    });
  } catch (error) {
    console.error("Error logging in:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

module.exports = createExam;
