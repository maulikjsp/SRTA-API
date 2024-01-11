const { pool } = require("../../config/db");

const getProcedures = async (req, res) => {
  try {
    const proceduresQuery = await pool.query(`
    SELECT DISTINCT "procedures"."id","procedures"."title", "procedures"."section_id"
    FROM "procedures"
    INNER JOIN "exam_procedure_status" ON "exam_procedure_status"."procedureid" = "procedures"."id"
    WHERE NOT EXISTS (
        SELECT 1
        FROM "procedure_submission"
        WHERE "procedure_submission"."procedure_id" = "procedures"."id"
        AND "exam_procedure_status"."status" = 'completed'
    );    
    `);

    const procedures = proceduresQuery.rows;
    return res.status(201).json({ procedures: procedures });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

module.exports = getProcedures;
