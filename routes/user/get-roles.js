const { pool } = require("../../config/db");
const getRoles = async (req, res) => {
  try {
    const rolesQuery = await pool.query("SELECT * FROM roles");
    const roles = rolesQuery.rows;
    res.setHeader("Access-Control-Allow-Origin", "*"); // Replace '*' with your allowed origins
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, DELETE");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
    return res.status(200).json({
      roles: roles,
    });
  } catch (error) {
    console.error("Error logging in:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

module.exports = getRoles;
