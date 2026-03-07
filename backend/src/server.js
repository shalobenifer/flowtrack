import cors from "cors";
import express from "express";
import cookieParser from "cookie-parser";
import authRoutes from "./routes/auth.route.js";
import projectRoute from "./routes/project.route.js";

const app = express();

app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
  }),
);
app.use(express.json());
app.use(cookieParser());

app.use("/api/auth", authRoutes);
app.use("/api/projects", projectRoute);

app.get("/", (req, res) => {
  res.send("Backend running");
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running at port ${PORT}`);
});
