const { pool } = require("../../config/db");
const bcrypt = require("bcrypt");

const updateUser = async (req, res) => {
  try {
    const rolesQuery = pool.query("SELECT * FROM roles");
    const rolesName = (await rolesQuery).rows;
    const { userId } = req.params; // Extract user ID from the URL parameters
    const roles = rolesName.map((role) => role?.role_name);
    const { firstname, lastname, email, phone, role, username } = req.body;

    // Check if the user ID is provided in the request params
    // if (!userId) {
    //   return res.status(400).json({ message: "User ID is required" });
    // }
    // Check if the user with the given ID exists
    const userExists = await pool.query("SELECT * FROM users WHERE id = $1", [userId]);

    if (userExists.rows.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    // Validate and process the user role, similar to the createUser function
    // if (!roles.includes(role?.toLowerCase())) {
    //   return res.status(400).json({ message: "Invalid role" });
    // }

    const roleQuery = await pool.query("SELECT role_id FROM roles WHERE role_name = $1", [role]);

    if (roleQuery.rows.length === 0) {
      return res.status(400).json({ message: "Invalid role" });
    }

    const roleId = roleQuery.rows[0].role_id;
    const updatedAt = new Date();

    // Update user information
    await pool.query(
      "UPDATE users SET role_id = $1, name = $2, email = $3, username = $4, phone = $5, updated_at = $6 WHERE id = $7",
      [roleId, `${firstname} ${lastname}`, email, username, phone, updatedAt, userId]
    );

    console.log(roles, "roles");
    return res.status(201).json({ message: "user updated successfully" });
  } catch (error) {
    console.log(error, "error");
    return res.status(500).json({ message: "Internal Server error" });
  }
};

module.exports = updateUser;
