const { pool } = require("../../config/db");

const updateExam = async (req, res) => {
  try {
    const { selectedRow, roledata } = req.body;
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
      id,
    } = selectedRow;
    const updated_at = new Date(); // Update the updated_at timestamp

    // Validate data before update (you can implement your validation logic here)

    // Check if the exam ID exists
    const examId = selectedRow.id;
    if (!examId) {
      return res.status(400).json({ message: "Exam ID is required for updating." });
    }

    // Check if the examname or examcode already exists for other exams
    const checkQuery = await pool.query(
      "SELECT * FROM exams WHERE (examname = $1 OR examcode = $2) AND id <> $3",
      [examname, examcode, examId]
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
          updated_at,
          examId, // Use the exam ID for updating the specific record
        ]
      );

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
