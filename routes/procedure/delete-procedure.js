const { pool } = require("../../config/db");

const deleteProcedure = async (req, res) => {
  try {
    const id = req.params.id;
    await pool.query("DELETE FROM procedures WHERE id=$1", [id]);
    return res.status(200).json({
      message: "Procedure Deleted successfully",
    });
  } catch (error) {
    return res.status(500).json({ message: "Server error" });
  }
};

module.exports = deleteProcedure;
