const jwt = require("jsonwebtoken");

function adminAuth(req, res, next) {
  const auth = req.headers.authorization;
  if (!auth?.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Missing token" });
  }

  const token = auth.split(" ")[1];

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    req.adminId = payload.adminId;
    next();
  } catch (e) {
    return res.status(401).json({ message: "Invalid/expired token" });
  }
}

module.exports = adminAuth;
