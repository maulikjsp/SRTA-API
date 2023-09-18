const { pool } = require("../../config/db");
const createPermission = async (req, res) => {
  try {
    const permissionName = req.body.permissionName;

    // Check if the examname or examcode already exists
    const checkQuery = await pool.query(
      "SELECT * FROM permissions WHERE permission_name = $1",
      [permissionName]
    );

    if (checkQuery.rows.length > 0) {
      return res.status(400).json({
        message: "Duplicate permission . permission creation failed.",
      });
    }

    await pool.query(`INSERT INTO permissions (permission_id, permission_name, permission_code) 
      VALUES ( (SELECT COALESCE(MAX(permission_id), 0) + 1 FROM permissions), '${permissionName}', LEFT('${permissionName}', 3) || '_' || RIGHT('${permissionName}', 3)
    );`);

    return res.status(200).json({
      message: "Permission Added successfully",
    });
  } catch (error) {
    console.error("Error logging in:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

module.exports = createPermission;
