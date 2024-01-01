const express = require("express");
const cors = require("cors");
const { Pool } = require("pg");
const jwt = require("jsonwebtoken");
const bodyParser = require("body-parser");
const bcrypt = require("bcrypt");
const { tokenVerification } = require("./middleware");
const routes = require("./routes");
const { Server } = require("socket.io");
const http = require("http");

const app = express();

const pool = new Pool({
  user: process.env.POSTGRES_USER || "maulikd",
  host: process.env.POSTGRES_HOST || "ep-aged-darkness-00061604.us-east-2.aws.neon.tech",
  database: process.env.POSTGRES_DATABASE || "SRTA",
  password: process.env.POSTGRES_PASSWORD || "c0J7mahetQHw",
  port: process.env.POSTGRES_PORT || 5432,
  ssl: true,
});
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: ["http://localhost:3000", "http://192.168.1.25:3000", "https://srta-5t7o.vercel.app/"],
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  console.log(`a user connected ${socket.id}`);

  socket.on("evaluation status updated", async (data) => {
    const { status, procedure_id, student_id, submited_examiner_id } = data;
    console.log("working");
    await pool.query(
      `UPDATE exam_procedure_status SET status = $1, submited_examiner_id = $4 WHERE procedureid = $2 AND student_id = $3`,
      [status, procedure_id, student_id, submited_examiner_id]
    );
    const queryResult = await pool.query(`
    SELECT
    "exam_procedure_status"."id",
    "exam_procedure_status"."student_id" AS "studentCode",
    "exams"."active" AS "currentExamStatus",
    "procedures"."title" AS "onGoingProcedure",
    "users"."name" AS "currentAssignedExaminer",  
    "exam_procedure_status"."assigned_date" AS "AssignedDate",
    "exam_procedure_status"."procedureid",
    "exam_procedure_status"."examiner_id",
    "exam_procedure_status"."exam_id",
    "exam_procedure_status"."status",
    "exams"."examname"
FROM  
    exam_procedure_status
INNER JOIN 
    "procedures" ON "procedures"."id" = "exam_procedure_status"."procedureid"
INNER JOIN 
    "exams" ON "exams"."id" = "exam_procedure_status"."exam_id"
LEFT JOIN
    "users" ON "users"."id" = "exam_procedure_status"."examiner_id";`);

    // Extract the rows from the query result
    const records = queryResult.rows;
    socket.broadcast.emit("evaluation status", records);
  });
});

app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

const userRoles = ["admin", "evaluator", "assistant", "manager", "investigator"];

// * Api routes
app.use("/api", routes);

app.post("/api/register", async (req, res) => {
  const { name, email, username, phone, password, role } = req.body;
  if (
    !name ||
    !email ||
    !password ||
    !username ||
    !phone ||
    !userRoles.includes(role.toLowerCase())
  ) {
    return res.status(400).json({ message: "Invalid input data" });
  }

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
      [roleId, name, email, username, phone, hashedPassword]
    );

    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, DELETE");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
    return res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    console.error("Error registering user:", error);
    return res.status(500).json({ message: "Server error" });
  }
});

app.post("/api/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    // Find the user by email in the "users" table
    const userQuery = await pool.query("SELECT * FROM users WHERE email = $1", [email]);

    if (userQuery.rows.length === 0) {
      return res.status(401).json({ message: "User not Exist" });
    }

    const user = userQuery.rows[0];

    // Compare the provided password with the hashed password in the database
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({ message: "Incorrect password" });
    }

    // Generate a JWT token
    const token = jwt.sign(
      { id: user.id, role: user.role_id },
      "super-secret-6FDFBB8F-2909-4565-85EA-3F685784355E", // Replace with your secret key
      { expiresIn: "24h" }
    );

    // Get the role name based on the role_id from the "roles" table
    const roleQuery = await pool.query("SELECT role_name, role_id FROM roles WHERE role_id = $1", [
      user?.role_id,
    ]);
    const userRole = roleQuery.rows[0];

    // Add response headers
    res.setHeader("Access-Control-Allow-Origin", "*"); // Replace '*' with your allowed origins
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, DELETE");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
    console.log("user logged in ");
    return res.status(200).json({
      message: "Login successful",
      accessToken: token,
      userData: {
        username: user?.username || "",
        email: user?.email,
        role: userRole,
        name: user?.name,
        id: user?.id,
      },
    });
  } catch (error) {
    console.error("Error logging in:", error);
    return res.status(500).json({ message: "Server error" });
  }
});
app.get("/api/get-users", tokenVerification, async (req, res) => {
  try {
    const userQuery = await pool.query(
      "SELECT u.id, u.name, u.username, u.email, u.phone, r.role_name, u.role_id FROM users u INNER JOIN roles r ON u.role_id = r.role_id"
    );
    // Get the role name based on the role_id from the "roles" table
    const users = userQuery.rows;
    // Add response headers
    res.setHeader("Access-Control-Allow-Origin", "*"); // Replace '*' with your allowed origins
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, DELETE");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
    return res.status(200).json({
      users: users,
    });
  } catch (error) {
    console.error("Error logging in:", error);
    return res.status(500).json({ message: "Server error" });
  }
});
app.get("/api/test", tokenVerification, async (req, res) => {
  try {
    // Simulate some server logic
    // You can replace this with your actual logic
    const responseData = { message: "hello from server" };
    // Add response headers
    res.setHeader("Access-Control-Allow-Origin", "*"); // Replace '*' with your allowed origins
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, DELETE");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");

    return res.status(200).json(responseData);
  } catch (error) {
    console.error("Error:", error);
    return res.status(500).json({ message: "Server error" });
  }
});

// Add other routes here

const port = process.env.PORT || 3002;

server.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
