const { Pool } = require("pg");
require("dotenv").config();
const pool = new Pool({
  user: process.env.POSTGRES_USER || "maulikd",
  host: process.env.POSTGRES_HOST || "ep-aged-darkness-00061604.us-east-2.aws.neon.tech",
  database: process.env.POSTGRES_DATABASE || "SRTA",
  password: process.env.POSTGRES_PASSWORD || "c0J7mahetQHw",
  port: process.env.POSTGRES_PORT || 5432,
  ssl: true,
});
const poolUat = new Pool({
  user: process.env.POSTGRES_USER || "maulikd",
  host: process.env.POSTGRES_HOST || "ep-aged-darkness-00061604.us-east-2.aws.neon.tech",
  database: "srta-uat",
  password: process.env.POSTGRES_PASSWORD || "c0J7mahetQHw",
  port: process.env.POSTGRES_PORT || 5432,
  ssl: true,
});
module.exports = { pool, poolUat };
