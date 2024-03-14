const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../config");

function authMiddleware(req, res, next) {
  try {
    const header = req.headers.authorization;
    if (header.startsWith("Bearer")) {
      const token = header.split("Bearer ");
      const decoded = jwt.verify(token[1], JWT_SECRET);
      req.decodedVal = decoded;
      next();
    } else {
      res.json({
        message: "Invalid token Type plz use Bearer",
      });
    }
  } catch (e) {
    return res.status(403).json({
      message: "cannot provide access to invalid user ",
    });
  }
}

module.exports = authMiddleware;
