const { pool } = require("../../config/db");

const getCallBoardStatus = async (req, res) => {
  try {
    const callBoardQuery = await pool.query(`SELECT
    s.id::INT AS id,
    s.name::VARCHAR(255) AS name,
    s.uuid::VARCHAR AS student_uuid,
    COALESCE(MAX(
        CASE
            WHEN ps.student_id IS NOT NULL THEN 'Completed'::VARCHAR(255)
            WHEN u.role_id = 2 AND es.student_id IS NOT NULL THEN 'Evaluating'::VARCHAR(255)
            ELSE 'Not Started'::VARCHAR(255)
        END
    )::VARCHAR(255), 'Not Started') AS exam_status,
    JSONB_AGG(
        DISTINCT JSONB_BUILD_OBJECT(
            'name', COALESCE(u.name, 'Unknown'), 
            'status', CASE
                WHEN ps.student_id IS NOT NULL THEN 'Completed'::VARCHAR(255)
                WHEN es.student_id IS NOT NULL THEN 'Pending'::VARCHAR(255)
                ELSE 'Not Started'::VARCHAR(255)
            END
        )
    ) AS evaluators
FROM
    students s
INNER JOIN
    exams e ON s.exam_id = e.id
LEFT JOIN
    exam_user eu ON eu.exam_id = e.id
LEFT JOIN
    procedure_submission ps ON ps.student_id = s.id AND ps.examiner_id = eu.user_id
LEFT JOIN
    exam_submission es ON es.student_id = s.id AND es.examiner_id = eu.user_id
LEFT JOIN
    users u ON u.id = eu.user_id
WHERE
    e.active = true
    AND (u.role_id = 2 OR ps.student_id IS NOT NULL)
GROUP BY
    s.id, s.name, s.uuid;
`);
    return res.status(201).json({
      data: callBoardQuery.rows,
    });
  } catch (error) {
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

module.exports = getCallBoardStatus;
