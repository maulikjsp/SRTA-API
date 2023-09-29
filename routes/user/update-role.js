const { pool } = require("../../config/db");

const updateRole = async (req, res) => {
  try {
    const { roleId } = req.params;
    const { permissions } = req.body;
    const roleExists = await pool.query(`SELECT * FROM roles WHERE role_id = ${roleId}`);

    if (roleExists.rows.length === 0) {
      return res.status(404).json({ message: "Role not found" });
    }
    if (permissions === "") {
      return res.status(404).json({ message: "Role permissions not empty" });
    }
    await pool.query(`UPDATE roles SET permissions = ${permissions} WHERE role_id = ${roleId}`);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal Server error" });
  }
};

module.exports = updateRole;
