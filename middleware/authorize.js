const jwt = require("jsonwebtoken");

const verifyToken = (req, res, next) => {
  //Find bearerToken from common locations
  const bearerToken = req.headers["x-access-token"] || req.headers["Authorization"] || req.headers["authorization"];

  if (!bearerToken) {
    return res.status(403).json({ error: "A token is required for authentication" });
  }
  
  //Grab the token itself
  const token = bearerToken.split(" ")[1];
  try {
    const decoded = jwt.verify(token, process.env.secret);
    req.user = decoded;
  } catch (err) {
    return res.status(401).json({ error: "Invalid Token" });
  }
  return next();
};

module.exports = verifyToken;
