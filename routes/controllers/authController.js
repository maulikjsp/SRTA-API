// controllers/authController.js

const crypto = require("crypto");
const nodemailer = require("nodemailer");
const bcrypt = require("bcrypt");
const { pool } = require("../../config/db");

// Function to initiate the password reset
exports.initiateReset = async (req, res) => {
  const { email } = req.body;

  // Generate reset token and save it to the user
  const resetToken = crypto.randomBytes(20).toString("hex");
  const now = new Date();
  now.setHours(now.getHours() + 1); // Token valid for 1 hour

  const query = `
    UPDATE users
    SET reset_token = $1, reset_token_expires = $2
    WHERE email = $3
    RETURNING *;
  `;

  const values = [resetToken, now, email];

  try {
    const result = await pool.query(query, values);
    const user = result.rows[0];

    // Send email with reset link
    const transporter = nodemailer.createTransport({
      // configure your email provider here
      host: "sandbox.smtp.mailtrap.io",
      port: 2525,
      auth: {
        user: "85cf47f8df4525",
        pass: "323e165066b934",
      },
    });

    const mailOptions = {
      to: user.email,
      from: process.env.ADMIN_EMAIL,
      subject: "Password Reset",
      html: `<!DOCTYPE html> <html lang="en"> <head> <meta charset="UTF-8"> <meta name="viewport" content="width=device-width, initial-scale=1.0"> <title>Password Reset</title> <style> body { font-family: 'Arial', sans-serif; margin: 0; padding: 0; background-color: #f4f4f4; } .container { max-width: 600px; margin: 0 auto; padding: 20px; background-color: #ffffff; box-shadow: 0 0 10px rgba(0, 0, 0, 0.1); border-radius: 5px; margin-top: 20px; } h2 { color: #333333; } p { color: #555555; } a { color: #007BFF; text-decoration: none; } .footer { margin-top: 20px; text-align: center; color: #999999; } </style> </head> <body> <div class="container"> <h2>Password Reset</h2> <p>Hello,</p> <p>We received a request to reset the password associated with this email address. If you made this request, please click the link below to reset your password:</p> <p><a href="${process.env.PROD_URL}/reset/${resetToken}" target="_blank">Reset Your Password</a></p> <p>If you didn't make this request, you can ignore this email, and your password will remain unchanged.</p> <p>Thank you!</p> <div class="footer"> <p>This is an automated email. Please do not reply.</p> </div> </div> </body> </html>`,
    };

    transporter.sendMail(mailOptions, (err) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ message: "Error sending email" });
      }
      res.json({ message: "Email sent with password reset instructions." });
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error initiating password reset." });
  }
};

// Function to verify the reset token
exports.verifyToken = async (req, res) => {
  const token = req.params.token;

  const query = `
    SELECT *
    FROM users
    WHERE reset_token = $1 AND reset_token_expires > NOW();
  `;

  const values = [token];

  try {
    const result = await pool.query(query, values);
    const user = result.rows[0];

    if (!user) {
      return res.status(400).json({ message: "Invalid or expired token." });
    }

    // Render a form to reset the password
    res.render("resetPassword", { token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error verifying reset token." });
  }
};

// Function to reset the password
exports.resetPassword = async (req, res) => {
  const { token } = req.params;
  const { password } = req.body;

  const hashedPassword = await bcrypt.hash(password, 10);

  const query = `
    UPDATE users
    SET password = $1, reset_token = NULL, reset_token_expires = NULL
    WHERE reset_token = $2 AND reset_token_expires > NOW()
    RETURNING *;
  `;

  const values = [hashedPassword, token];

  try {
    const result = await pool.query(query, values);
    const user = result.rows[0];

    if (!user) {
      return res.status(400).json({ message: "Invalid or expired token." });
    }

    res.json({ message: "Password reset successfully." });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error resetting password." });
  }
};
