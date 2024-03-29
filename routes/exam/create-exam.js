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
    const { selectedRow, roledata, ExamSections, ExamStudents } = req.body;
    const {
      SiteCode,
      examcode,
      EventDate,
      ApplicationDeadline,
      active,
      type,
      Name,
      State,
      Zip,
      Address1,
      Id,
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
          Name,
          State,
          Zip,
          Address1,
          created_at,
          updated_at,
          Id,
        ]
      );

      // Access the created exam's ID from the result
      createdExamId = exam.rows[0]?.id;
      console.log("createdExamId", createdExamId);

      try {
        if (createdExamId !== undefined) {
          const queryCheck = `SELECT * FROM examtypes WHERE type = $1`;
          const valuesCheck = [type];
          const result = await pool.query(queryCheck, valuesCheck);

          if (result.rows.length === 0) {
            // Exam type does not exist, insert it
            const queryInsert = `INSERT INTO examtypes (examid, type) VALUES ($1, $2) ON CONFLICT DO NOTHING`;
            const valuesInsert = [createdExamId, type];
            await pool.query(queryInsert, valuesInsert);
            console.log("Exam created successfully.");
          } else {
            // Exam type already exists
            console.log("Exam type already exists. Not inserting.");
          }
        } else {
          console.error("Exam creation failed.");
        }
      } catch (error) {
        // Handle any errors that may occur during the query
        console.error("Error inserting/exam checking:", error);
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

    // Insert Exam section into exam_section table
    if (ExamSections.length !== 0) {
      for (let i = 0; i < ExamSections.length; i++) {
        const checkSectionQuery = `
      SELECT id FROM sections
      WHERE title = $1
    `;
        const checkSectionValues = [ExamSections[i]?.Name];
        const checkSectionResult = await pool.query(checkSectionQuery, checkSectionValues);
        const sectionQuery = `
        INSERT INTO sections(created_at, ext_section_id, title, updated_at)
        VALUES
        ($1, $2, $3, $4)
        `;
        const sectionValues = [created_at, ExamSections[i]?.Id, ExamSections[i]?.Name, updated_at];

        try {
          let sectionId = null;
          if (checkSectionResult.rows.length > 0) {
            sectionId = checkSectionResult.rows[0]?.id;
            console.log("already exists section query worked");
          } else {
            const sectionData = await pool.query(sectionQuery, sectionValues);
            sectionId = sectionData.rows[0]?.id;
          }
          // console.log(sectionData.rows[0], "sectionIdsectionId");
          // add group info after section created
          if (sectionId !== undefined) {
            const query = `
        INSERT INTO exam_sections(created_at, exam_id, section_id,updated_at)
        VALUES
        ($1, $2, $3, $4)`;
            const values = [created_at, createdExamId, sectionId, updated_at];
            const groupQuery = `
            INSERT INTO groups(created_at, exam_section_id, title, updated_at)
            VALUES
            ($1, $2, $3, $4)
            `;
            const value = [created_at, sectionId, ExamSections[i]?.ScheduleName, updated_at];
            await pool.query(groupQuery, value);
            await pool.query(query, values);
          }
        } catch (error) {
          // Handle any errors that may occur during the database query
          console.error(`Error inserting row ${i + 1}:`, error);
        }
      }
    }
    // Insert Students into students table
    if (ExamStudents.length !== 0) {
      for (let i = 0; i < ExamStudents.length; i++) {
        const extStudentId = ExamStudents[i]?.UserId;

        // Check if the student already exists
        const checkStudentQuery = `
          SELECT id FROM students
          WHERE ext_student_id = $1 AND exam_id = $2`;
        const checkStudentValues = [extStudentId, createdExamId];

        try {
          const checkStudentResult = await pool.query(checkStudentQuery, checkStudentValues);

          // If the student already exists, skip insertion
          if (checkStudentResult.rows.length > 0) {
            console.log(
              `Student with ext_student_id ${extStudentId} already exists. Skipping insertion.`
            );
            continue;
          }
        } catch (error) {
          console.error(`Error checking for existing student:`, error);
          return res.status(500).json({ message: "Server error", error: error });
        }

        // If the student does not exist, perform the insertion
        const insertStudentQuery = `
          INSERT INTO students(sequence_number, ext_student_id, exam_id, name, surname, email, address, phone, social, school, graduation_date, created_at, updated_at, is_present, is_terminated, reason, uuid)
          VALUES
          ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17)`;
        const uuid = await pool.query("SELECT generate_user_id('STD') as uuid");
        const UUID = uuid?.rows[0];
        console.log(uuid?.rows[0], "uuid");
        const insertStudentValues = [
          ExamStudents[i]?.CandidateExamSeqNum,
          extStudentId,
          createdExamId,
          ExamStudents[i]?.student_name,
          ExamStudents[i]?.student_surname,
          ExamStudents[i]?.EmailAddress,
          ExamStudents[i]?.StreetAddress,
          ExamStudents[i]?.phone,
          ExamStudents[i]?.SocialSecurity,
          ExamStudents[i]?.school,
          ExamStudents[i]?.GraduationDate,
          created_at,
          updated_at,
          null,
          null,
          "",
          UUID?.uuid,
        ];

        try {
          await pool.query(insertStudentQuery, insertStudentValues);
        } catch (error) {
          console.error(`Error inserting row ${i + 1}:`, error);
          return res.status(500).json({ message: "Server error", error: error });
        }
      }
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
