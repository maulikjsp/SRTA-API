const { pool } = require("../../config/db");

const updateExam = async (req, res) => {
  try {
    const { selectedRow, roledata } = req.body;
    const { examcode, start_date, end_date, active, type, facility, state, zip, address, examId } =
      selectedRow;
    const updated_at = new Date(); // Update the updated_at timestamp

    // Validate data before update (you can implement your validation logic here)

    // Check if the exam ID exists
    if (!examId) {
      return res.status(400).json({ message: "Exam ID is required for updating." });
    }

    // Check if the examname or examcode already exists for other exams
    const checkQuery = await pool.query(
      "SELECT * FROM exams WHERE (examname = $1 OR examcode = $2) AND id <> $3",
      [examcode, examcode, examId]
    );

    if (checkQuery.rows.length > 0) {
      return res.status(400).json({
        message: "Duplicate examname or examcode. Exam update failed.",
      });
    }

    try {
      // Update the exam record
      await pool.query(
        `UPDATE exams
        SET examname = $1, examcode = $2, start_date = $3, end_date = $4, active = $5,
        type = $6, facility_name = $7, state = $8, zip = $9, address = $10, updated_at = $11
        WHERE id = $12`,
        [
          examcode,
          examcode,
          start_date,
          end_date,
          active,
          type,
          facility,
          state,
          zip,
          address,
          updated_at,
          examId, // Use the exam ID for updating the specific record
        ]
      );

      // Insert Exam User into the table if exam creation was successful
      if (roledata && roledata.length && examId !== undefined) {
        for (let i = 0; i < roledata.length; i++) {
          const userExistsQuery = `
            SELECT 1
            FROM exam_user
            WHERE exam_id = $1
            AND user_id = $2;
          `;

          const userExistsValues = [examId, roledata[i]];

          const userExistsResult = await pool.query(userExistsQuery, userExistsValues);

          if (userExistsResult.rows.length === 0) {
            // If the user doesn't exist, insert a new row
            const insertQuery = `
              INSERT INTO exam_user (exam_id, type, updated_at, user_id, created_at)
              VALUES ($1, $2, $3, $4, NOW());
            `;

            const insertValues = [examId, type, updated_at, roledata[i]];

            try {
              await pool.query(insertQuery, insertValues);
            } catch (error) {
              console.error(`Error inserting row ${i + 1}:`, error);
            }
          } else {
            // If the user exists, update the existing row
            const updateQuery = `
              UPDATE exam_user
              SET
                type = $2,
                updated_at = $3
              WHERE
                exam_id = $1
                AND user_id = $4;
            `;

            const updateValues = [examId, type, updated_at, roledata[i]];

            try {
              await pool.query(updateQuery, updateValues);
            } catch (error) {
              console.error(`Error updating row ${i + 1}:`, error);
            }
          }
        }
      } else {
        console.error("roledata is undefined or empty.");
      }

      console.log("Exam updated successfully.");
    } catch (error) {
      // Handle any errors that may occur during the update query
      console.error("Error updating exam:", error);
      return res.status(500).json({ message: "Error updating exam" });
    }

    // You can now update the associated roles/users here if needed

    return res.status(200).json({
      message: "Exam updated successfully",
    });
  } catch (error) {
    console.error("Error updating exam:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

// Export the updateExam function
module.exports = updateExam;
