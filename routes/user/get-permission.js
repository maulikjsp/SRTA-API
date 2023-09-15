const { pool } = require("../../config/db");
const getPermissions = async (req, res) => {
  try {
    const permissionQuery = await pool.query("SELECT * FROM permissions");
    const permissions = permissionQuery.rows;
    // res.writeHead(200, headers);
    return res.status(200).json({
      permissions: permissions,
    });
  } catch (error) {
    console.error("Error logging in:", error);
    return res.status(500).json({ message: "Server error" });
  }
};
module.exports = getPermissions;
