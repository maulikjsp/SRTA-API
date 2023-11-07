const { pool } = require("../../config/db");

const updateStudent = async (req, res) => {
  try {
    const {
      id,
      firstname,
      lastname,
      sequencenumber,
      email,
      address,
      social,
      school,
      graduation_date,
    } = req.body;

    await pool.query(
      `UPDATE students SET name = $1, surname = $2, email = $3, address = $4, school = $5, graduation_date = $6, social = $7, sequence_number = $8 WHERE id = $9`,
      [firstname, lastname, email, address, school, graduation_date, social, sequencenumber, id]
    );
    return res.status(200).json({
      message: "student updated successfully",
    });
  } catch (error) {
    return res.status(500).json({ message: "Server error" });
  }
};

module.exports = updateStudent;
