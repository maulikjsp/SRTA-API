require("dotenv").config();

module.exports = {
  PORT: process.env.PORT,
  POSTGRES_HOST: process.env.POSTGRES_HOST,
  POSTGRES_USER: process.env.POSTGRES_USER,
  POSTGRES_DATABASE: process.env.POSTGRES_DATABASE,
  POSTGRES_PASSWORD: process.env.POSTGRES_PASSWORD,
  //   DB_NAME: process.env.DB_NAME,
  //   DB_USER: process.env.DB_USER,
  //   DB_PASS: process.env.DB_PASS,
  SECRET: "unique",
  //   MAIL_HOST: process.env.MAIL_HOST,
  //   MAIL_PORT: process.env.MAIL_PORT,
  //   MAIL_USER: process.env.MAIL_USER,
  //   MAIL_PASS: process.env.MAIL_PASS,
};
