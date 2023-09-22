const { pool } = require("../../config/db");
const bcrypt = require("bcrypt");

const createUser = async (req, res) => {
  const userRoles = ["admin", "evaluator", "assistant", "manager", "investigator"];

    const { firstname, lastname, email, username, phone, role, password } = req.body;
  if (!firstname) {
    return res.status(400).json({ message: "First name is required" });
  }
  if (!lastname) {
    return res.status(400).json({ message: "Last name is required" });
  }
  if (!email) {
    return res.status(400).json({ message: "Email is required" });
  }
  if (!username) {
    return res.status(400).json({ message: "Username is required" });
  }
  if (!phone) {
    return res.status(400).json({ message: "Phone is required" });
  }
  if (!userRoles.includes(role.toLowerCase())) {
    return res.status(400).json({ message: "Invalid role" });
  }

  // Additional validation for email and phone fields if needed

  try {
    const userExists = await pool.query("SELECT * FROM users WHERE email = $1", [email]);
    if (userExists.rows.length > 0) {
      return res.status(400).json({ message: "User with this email already exists" });
    }

    const roleQuery = await pool.query("SELECT role_id FROM roles WHERE role_name = $1", [role]);

    if (roleQuery.rows.length === 0) {
      return res.status(400).json({ message: "Invalid role" });
    }

    const roleId = roleQuery.rows[0].role_id;

    const hashedPassword = await bcrypt.hash(password, 10);

    await pool.query(
      "INSERT INTO users (role_id, name, email, username, phone, password) VALUES ($1, $2, $3, $4, $5, $6)",
      [roleId, `${firstname} ${lastname}`, email, username, phone, hashedPassword]
    );

    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, DELETE");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");

    return res.status(201).json({ message: "User created successfully" });
  } catch (error) {
    console.log("err", error);
    return res.status(500).json({ message: "Internal Server error" });
  }
};

module.exports = createUser;
