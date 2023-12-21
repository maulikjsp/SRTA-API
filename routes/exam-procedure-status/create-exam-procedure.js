const { pool } = require("../../config/db");

const createExamProcedure = async (req, res) => {
  try {
    const { procedureid, exam_id, assigned_date, student_id } = req.body;

    // Fetch all available examiners
    const examinerQuery = await pool.query(`
      SELECT "users"."id"
      FROM users
      INNER JOIN roles ON "users"."role_id" = "roles"."role_id"
      WHERE "roles"."role_name" = 'examiner'
    `);

    // Fetch the list of examiners already assigned for the given procedure
    const assignedExaminersQuery = await pool.query(
      "SELECT examiner_id FROM exam_procedure_status WHERE procedureid = $1",
      [procedureid]
    );

    const assignedExaminers = assignedExaminersQuery.rows.map((row) => row.examiner_id);

    let examiner_id = 1;

    // Find the first available and unassigned examiner
    const availableExaminer = examinerQuery.rows.find(
      (examiner) => !assignedExaminers.includes(examiner.id)
    );

    // Check if the record already exists
    const checkQuery = await pool.query(
      "SELECT * FROM exam_procedure_status WHERE procedureid = $1 AND student_id = $2 AND exam_id = $3",
      [procedureid, student_id, exam_id]
    );

    if (checkQuery.rows.length > 0) {
      return res.status(400).json({
        message: "Record already exists",
      });
    }

    if (availableExaminer) {
      examiner_id = availableExaminer.id;

      // Insert data into the table
      const insertQuery = await pool.query(
        "INSERT INTO exam_procedure_status (procedureid, examiner_id, exam_id, assigned_date, student_id, status) VALUES ($1, $2, $3, $4, $5, $6)",
        [procedureid, examiner_id, exam_id, assigned_date, student_id, "Not Completed"]
      );

      return res.status(201).json({ message: "Student added successfully" });
    } else {
      // If no available and unassigned examiners, set examiner_id as null
      const insertQuery = await pool.query(
        "INSERT INTO exam_procedure_status (procedureid, examiner_id, exam_id, assigned_date, student_id) VALUES ($1, $2, $3, $4, $5)",
        [procedureid, 1, exam_id, assigned_date, student_id]
      );

      return res.status(201).json({
        message: "All examiners are already assigned, student added with examiner_id as null",
      });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

module.exports = createExamProcedure;
