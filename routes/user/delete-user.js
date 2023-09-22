const { pool } = require("../../config/db");

const deleteUser = async (req, res) => {
  try {
    const userId = parseInt(req.params.userId);
    await pool.query(`DELETE FROM users WHERE id=${userId}`);
    return res.status(201).json({ message: "User deleted successfully" });
  } catch (error) {
    console.log(error, "error");
    return res.status(500).json({ message: "Internal Server error" });
  }
};

module.exports = deleteUser;
