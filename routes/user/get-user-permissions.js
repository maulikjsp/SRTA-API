const { pool } = require("../../config/db");

const getUserPermissions = async (req, res) => {
  const email = req.body.email;
  try {
    const userQuery = await pool.query("SELECT * FROM users WHERE email = $1", [email]);
    const user = userQuery.rows[0];
    // Get the role name based on the role_id from the "roles" table
    const roleQuery = await pool.query(
      "SELECT role_name, role_id, permissions FROM roles WHERE role_id = $1",
      [user?.role_id]
    );
    const userRole = roleQuery.rows[0];

    return res.status(200).json({
      role: userRole,
    });
  } catch (error) {
    return res.status(500).json({ message: "Server error" });
  }
};

module.exports = getUserPermissions;
