const jwt = require("jsonwebtoken");

function verifyToken(role) {
  return function (req, res, next) {
    if (!req.headers.authorization) {
      return res.status(403).json({
        message: "User not authenticated !Token is not provided",
      });
    }
    const token = req.headers.authorization.split(" ")[1];
    console.log(token);
    if (!token) {
      return res.status(403).json({ message: "Token is not provided" });
    }

    jwt.verify(token, "your_secret_key", (err, decoded) => {
      if (err) {
        console.error("Token verification error:", err); // Log the error
        return res.status(401).json({ message: "Unauthorized" });
      }
      console.log("Decoded token payload:", decoded); // Log the decoded payload
      // Check if the role is allowed
      if (role && decoded.role !== role) {
        return res.status(403).json({ message: "Forbidden" });
      }
      req.user = decoded;
      next();
    });
  };
}

function isAdmin(req, res, next) {
  if (req.user && req.user.role === "admin") {
    next();
  } else {
    return res
      .status(403)
      .json({ message: "Forbidden - Admin access required" });
  }
}

module.exports = { verifyToken, isAdmin };
