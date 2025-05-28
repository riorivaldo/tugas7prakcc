import jwt from "jsonwebtoken";

export const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader)
    return res.status(401).json({ msg: "Access denied, token missing" });

  // Format Authorization: Bearer <token>
  const token = authHeader.split(" ")[1];

  if (!token)
    return res.status(401).json({ msg: "Access denied, token invalid" });

  try {
    const verified = jwt.verify(token, process.env.JWT_SECRET);
    req.user = verified; // simpan payload token di req.user
    next();
  } catch (error) {
    res.status(401).json({ msg: "Token tidak valid" });
  }
};
