const jwt = require("jsonwebtoken");
const { ApiError } = require("./../middleware/errorHandler");

function verifyToken(req, res, next) {
  const header = req.headers.authorization;
  const token = header?.split(" ")[1];

  if (!token) return next(new ApiError(401, "No token provided"));

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    return next();
  } catch {
    return next(new ApiError(401, "Invalid token"));
  }
}

function verifyAdmin(req, res, next) {
  const token = req.cookies?.adminToken;
  if (!token) return next(new ApiError(401, "No admin token provided"));

  try {
    const decoded = jwt.verify(token, process.env.ADMIN_JWT_SECRET);
    if (!["admin", "superadmin"].includes(decoded.role)) {
      return next(new ApiError(403, "Forbidden"));
    }
    req.user = decoded;
    return next();
  } catch {
    return next(new ApiError(401, "Invalid admin token"));
  }
}

module.exports = { verifyToken, verifyAdmin };

