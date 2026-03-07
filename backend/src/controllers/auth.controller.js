import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { v4 as uuidv4 } from "uuid";
import redisClient from "../../config/redis.js";
import pool from "../db/index.js";

export const register = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    const result = await pool.query(
      "INSERT INTO users(name,email,password_hash) VALUES($1,$2,$3) RETURNING id,name",
      [name, email, hashedPassword],
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    if (error.code === "23505")
      return res.status(400).json({ message: "Email already Exist" });
    res.status(500).json({ message: "Registration Failed" });
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const result = await pool.query("SELECT * FROM users WHERE email = $1", [
      email,
    ]);

    if (result.rows.length === 0)
      return res.status(401).json({ message: "Invalid Email" });

    const user = result.rows[0];

    const matched = await bcrypt.compare(password, user.password_hash);

    if (!matched) return res.status(401).json({ message: "Invalid Password" });

    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, {
      expiresIn: "1d",
      jwtid: uuidv4(),
    });

    res
      .cookie("token", token, {
        httpOnly: true,
        secure: true,
        sameSite: "none",
        maxAge: 24 * 60 * 60 * 1000,
      })
      .status(201)
      .json({ message: "Login successful", userId: user.id });
  } catch {
    res.status(500).json({ message: "Login Failed" });
  }
};

export const logout = async (req, res) => {
  try {
    const token = req.cookies.token;

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const expiresIn = decoded.exp - Math.floor(Date.now() / 1000);

    await redisClient.set(decoded.jti, "blacklisted", {
      EX: expiresIn,
    });

    res
      .clearCookie("token")
      .status(200)
      .json({ message: "Logged out successfully" });
  } catch {
    res.status(500).json({ message: "Logout failed" });
  }
};
