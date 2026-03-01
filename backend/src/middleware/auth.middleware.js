import jwt from "jsonwebtoken";
import redisClient from "../../config/redis.js";

export const authMiddleware = async (req, res, next) => {
  const token = req.cookies.token;

  if (!token) return res.status(401).json({ message: "No token found" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const blacklisted = await redisClient.get(decoded.jti);

    if (blacklisted)
      return res.status(401).json({ message: "Token is blacklisted" });

    const decode = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decode.userId;
    next();
  } catch {
    res.status(401).json({ message: "Invalid token" });
  }
};
