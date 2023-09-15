const { pool } = require("../../config/db");
const createPermission = async (req, res) => {
  try {
    const permissionName = req.body.permissionName;

    const PermissionQuery =
      await pool.query(`INSERT INTO permissions (permission_id, permission_name, permission_code) 
      VALUES ( (SELECT COALESCE(MAX(permission_id), 0) + 1 FROM permissions), '${permissionName}', LEFT('${permissionName}', 3) || '_' || RIGHT('${permissionName}', 3)
    );`);
    const permission = PermissionQuery;

    return res.status(200).json({
      permission: permission,
    });
  } catch (error) {
    console.error("Error logging in:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

module.exports = createPermission;
