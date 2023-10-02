const jwt = require("jsonwebtoken");
const Config = require("../../config");
// const { getDbUserData } = require("../../helpers");

const tokenVerification = (req, res, next) => {
  let token = req.headers.authorization.split(" ")[1];
  console.log(req.header("Authorization"), "header");
  if (!token) {
    return res.status(404).send({ status: 404, message: "No token provided!" });
  }
  jwt.verify(token, "super-secret-6FDFBB8F-2909-4565-85EA-3F685784355E", async (err, user) => {
    if (err) {
      return res.status(401).send({
        status: 401,
        message: "Token Unauthorized!",
        errorMessage: err.message,
      });
    }

    req.user = user;
    next();
  });
  //   next();
};

module.exports = { tokenVerification: tokenVerification };
