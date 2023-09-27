const { pool } = require("../../config/db");

const updatePermission = async (req, res) => {
  try {
    const { permissionId } = req.params;
    const { permissionName } = req.body;
    if (permissionName === "") {
      return res.status(400).json({ message: "Permission Name not Empty" });
    }

    pool.query(
      `UPDATE permissions SET permission_name = '${permissionName}' WHERE permission_id = ${permissionId}`
    );
    return res.status(201).json({ message: "permission updated successfully" });
  } catch (error) {
    return res.status(500).json({ message: "Internal Server error" });
  }
};
module.exports = updatePermission;
