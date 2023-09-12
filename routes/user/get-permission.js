const { pool } = require("../../config/db");
const getPermissions = async (req, res) => {
  try {
    const permissionQuery = await pool.query("SELECT * FROM permissions");
    const permissions = permissionQuery.rows;
    res.setHeader("Access-Control-Allow-Origin", "*"); // Replace '*' with your allowed origins
    res.setHeader(
      "Access-Control-Allow-Methods",
      "GET, POST, OPTIONS, PUT, DELETE"
    );
    res.setHeader(
      "Access-Control-Allow-Headers",
      "Content-Type, Authorization"
    );
    return res.status(200).json({
      permissions: permissions,
    });
  } catch (error) {
    console.error("Error logging in:", error);
    return res.status(500).json({ message: "Server error" });
  }
};
module.exports = getPermissions;
