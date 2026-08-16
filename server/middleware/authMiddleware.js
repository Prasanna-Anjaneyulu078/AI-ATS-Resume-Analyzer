import jwt from "jsonwebtoken";

export default function (req, res, next) {
  const token = req.cookies?.token || req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ error: "No token, authorization denied" });

  try {
    const jwtSecret = process.env.JWT_SECRET || "default_jwt_secret";
    req.user = jwt.verify(token, jwtSecret);
    next();
  } catch {
    res.status(401).json({ error: "Invalid token" });
  }
}