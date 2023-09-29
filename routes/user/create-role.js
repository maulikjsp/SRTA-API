const { pool } = require("../../config/db");

const createRole = async (req, res) => {
  try {
    const { role_name, permissions } = req.body;
    const createdAt = new Date();

    const roleExists = await pool.query("SELECT * FROM roles WHERE role_name = $1", [role_name]);
    if (roleExists.rows.length > 0) {
      return res.status(400).json({ message: "role already exists" });
    }

    // create role
    await pool.query("INSERT INTO roles (role_name, created_at, permissions) VALUES ($1, $2, $3)", [
      role_name,
      createdAt,
      permissions,
    ]);

    return res.status(201).json({ message: "user updated successfully" });
  } catch (error) {
    console.log(error, "error");
    return res.status(500).json({ message: "Internal Server error" });
  }
};

module.exports = createRole;
