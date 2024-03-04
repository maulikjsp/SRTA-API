// controllers/authController.js

const crypto = require("crypto");
const nodemailer = require("nodemailer");
const bcrypt = require("bcrypt");
const { pool } = require("../../config/db");

// Function to initiate the password reset
exports.initiateReset = async (req, res) => {
  const { email } = req.body;

  // Check if the user with the specified email exists
  const checkUserQuery = `
    SELECT *
    FROM users
    WHERE email = $1;
  `;

  const checkUserValues = [email];

  try {
    const userResult = await pool.query(checkUserQuery, checkUserValues);
    const user = userResult.rows[0];

    if (!user) {
      // If user does not exist, return an appropriate response
      return res.status(404).json({ message: "User not found." });
    }

    // Generate reset token and save it to the user
    const resetToken = crypto.randomBytes(20).toString("hex");
    const now = new Date();
    now.setHours(now.getHours() + 1); // Token valid for 1 hour

    // Update user with the reset token and expiration
    const updateQuery = `
      UPDATE users
      SET reset_token = $1, reset_token_expires = $2
      WHERE email = $3
      RETURNING *;
    `;

    const updateValues = [resetToken, now, email];

    const result = await pool.query(updateQuery, updateValues);
    const updatedUser = result.rows[0];

    // Send email with reset link
    const transporter = nodemailer.createTransport({
      host: "sandbox.smtp.mailtrap.io",
      port: 2525,
      auth: {
        user: "85cf47f8df4525",
        pass: "323e165066b934",
      },
    });

    const mailOptions = {
      to: updatedUser.email,
      from: process.env.ADMIN_EMAIL,
      subject: "Password Reset",
      html: `<!DOCTYPE html> <!-- ... your HTML template ... -->`,
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
