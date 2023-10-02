const { pool } = require("../../config/db");

const updateExam = async (req, res) => {
  try {
    const { examname, examcode, start_date, end_date, active,type, facility_name, state, zip, address, created_at, updated_at } = req.body;
  } catch (error) {
    return res.status(500).json({ message: "Server error" });
  }
};
