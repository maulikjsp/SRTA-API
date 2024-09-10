const { pool } = require("../../config/db");

const completeExamProcedureStatus = async (req, res) => {
  try {
    const { procedure_id, student_id, examiner_id, questionnaires_id, questionnaires, exam_id } =
      req.body;
    const questionnairesCriteria = JSON.parse(questionnaires);

    // Check if examiner has already submitted for the given procedure and student
    const existingSubmission = await pool.query(
      "SELECT * FROM procedure_submission WHERE procedure_id = $1 AND student_id = $2 AND examiner_id = $3",
      [procedure_id, student_id, examiner_id]
    );

    const checkExamProcedureCount = await pool.query(
      `SELECT * FROM procedure_submission WHERE procedure_id = $1 AND student_id = $2`,
      [procedure_id, student_id]
    );

    const getProcedureName = await pool.query(`SELECT * FROM procedures WHERE id = $1`, [
      procedure_id,
    ]);

    console.log(checkExamProcedureCount.rows.length, "checkExamProcedureCount");

    // if (existingSubmission.rows.length > 0) {
    //   return res
    //     .status(400)
    //     .json({ message: "Examiner has already submitted for this procedure and student." });
    // }

    const statuses = await Promise.all(
      questionnairesCriteria?.map(async (item, index) => {
        const result = await pool.query("SELECT check_student_status($1, $2, $3) AS status", [
          procedure_id,
          student_id,
          item?.id,
        ]);
        return result.rows[0]["status"];
      })
    );

    const completedCount =
      statuses.filter((status) => status === "completed").length === statuses.length;

    const escalated =
      statuses.length === questionnairesCriteria.length
        ? statuses.filter((status) => status === "pending").length > 2
        : false;
    const updateStatusQuery = `
        UPDATE exam_procedure_status
        SET status = $1, examiner_id = $2, escalated = $5
        WHERE procedureid = $3 AND student_id = $4
    `;

    const insertSubmissionQuery = `
      INSERT INTO procedure_submission (student_id, examiner_id, procedure_id, questionnaires, escalated )
      VALUES ($1, $2, $3, $4, $5)
    `;

    if (escalated) {
      const getMangerQuery = await pool.query(
        `
      SELECT user_id ,
      "users"."name",
      "roles"."role_name",
      "users"."email"
      FROM exam_user
      INNER JOIN users ON exam_user.user_id = "users"."id"
      INNER JOIN roles ON users.role_id = roles."role_id"
      WHERE exam_id = $1 AND roles.role_name = 'manager'
      `,
        [exam_id]
      );

      // console.log(getMangerQuery.rows[0]["email"], "getMangerQuery.rows[0]");

      const nodemailer = require("nodemailer");
      // Create a transporter using SMTP transport
      var transporter = nodemailer.createTransport({
        host: "sandbox.smtp.mailtrap.io",
        port: 2525,
        auth: {
          user: "85cf47f8df4525",
          pass: "323e165066b934",
        },
      });
      // Email content
      const mailOptions = {
        from: process.env.SUPPORT_EMAIL,
        to: getMangerQuery.rows[0]["email"],
        subject: `Student Escalation mail`,
        html: `<!DOCTYPE html> <html lang="en"> <head> <meta charset="UTF-8"> <meta http-equiv="X-UA-Compatible" content="IE=edge"> <meta name="viewport" content="width=device-width, initial-scale=1.0"> <title>Student Information and Procedure Update</title> <style> body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f5f5f5; margin: 0; padding: 0; } .container { max-width: 600px; margin: 20px auto; padding: 20px; border: 1px solid #ddd; border-radius: 10px; background-color: #fff; box-shadow: 0 0 10px rgba(0,0,0,0.1); } .header { background-color: #3498db; color: #fff; padding: 20px; text-align: center; border-radius: 10px 10px 0 0; } .content { margin-top: 20px; color: #555; } h3 { color: #3498db; } ul { list-style: none; padding: 0; } li { margin-bottom: 10px; } .footer { margin-top: 20px; text-align: center; color: #888; } </style> </head> <body> <div class="container"> <div class="header"> <h2>Student Information and Procedure Update</h2> </div> <div class="content"> <p>Hello ${getMangerQuery.rows[0]["name"]},</p> <p>We hope this email finds you well. Here is the information regarding your current status and the procedure you are involved in:</p> <h3>Student Information:</h3> <ul> <li><strong>Student ID:</strong> ${student_id}</li> <!-- Add more student information as needed --> </ul> <h3>Procedure Information:</h3> <p>${getProcedureName.rows[0]["title"]}</p> <!-- <h3>Escalation Information:</h3> <p>[Escalation details go here, if applicable]</p> --> <p>If you have any questions or concerns, please feel free to contact us at support@srta.com.</p> </div> <div class="footer"> <p>Thank you for choosing our services.</p> <p>Sincerely,<br>SRTA</p> </div> </div> </body> </html>`,
      };
      // console.log(process.env.SUPPORT_EMAIL, "process.env.SUPPORT_EMAIL");

      // Send email
      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          console.error(error);
        } else {
          console.log("Email sent: " + info.response);
        }
      });
    }

    await pool.query(updateStatusQuery, [
      completedCount ? "completed" : "pending",
      examiner_id,
      procedure_id,
      student_id,
      escalated,
    ]);

    await pool.query(insertSubmissionQuery, [
      student_id,
      examiner_id,
      procedure_id,
      questionnaires,
      escalated,
    ]);

    return res.status(200).json({
      message: "Procedure status updated",
      escalated: escalated,
      statuses: statuses,
    });
  } catch (error) {
    console.log(error, "Error");
    return res.status(500).json({ message: "Server error" });
  }
};

module.exports = completeExamProcedureStatus;
