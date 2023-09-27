const { pool } = require("../../config/db");

const deletePermission = async (req, res) => {
  try {
    const permissionId = parseInt(req.params.permissionId);
    await pool.query(`DELETE FROM permissions WHERE permission_id=${permissionId}`);
    return res.status(201).json({ message: "Permission deleted successfully" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal Server error" });
  }
};
module.exports = deletePermission;
