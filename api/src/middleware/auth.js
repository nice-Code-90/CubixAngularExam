const jwt = require("jsonwebtoken");
require("dotenv").config();

const secretKey = process.env.SECRET_KEY;

module.exports = (req, res, next) => {
  const token = req.headers["authorization"];

  if (!token) {
    return res.status(401).json({ error: "No token provided" });
  }

  try {
    const actualToken = token.split(" ")[1];

    const decoded = jwt.verify(actualToken, secretKey);

    req.userId = decoded.id;

    next();
  } catch (err) {
    console.error("Token verification error:", err);
    return res.status(401).json({ error: "Failed to authenticate token" });
  }
};
