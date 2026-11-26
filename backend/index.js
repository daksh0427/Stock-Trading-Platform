import express from "express";
import cors from "cors";
import helmet from "helmet";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import { pool } from "./src/db/index.js";
import { userRouter } from "./src/routes/user.routes.js";
import { stockRouter } from "./src/routes/stock.routes.js";
import { scheduleStockSimulation } from "./src/utils/BullMQ.js";
dotenv.config();
const app=express()
app.use(cookieParser())
app.use(cors({
  origin: true,
  credentials: true
}))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
const PORT = process.env.PORT || 5000;
const startServer = async () => {
  try {
    const conn = await pool.getConnection();
    console.log("✅ MySQL connected using .env variables");
    conn.release();

    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });
  } catch (err) {
    console.error("❌ DB connection failed:", err.message);
    process.exit(1); // kill app if DB fails
  }
};
app.use("/api/v1/users",userRouter)
app.use("/api/v1/stocks",stockRouter)

// ── Global JSON error handler ─────────────────────────────────────────────────
// Must have 4 args so Express treats it as an error handler
app.use((err, req, res, next) => {
  const statusCode = err.statuscode || err.statusCode || 500;
  const message    = err.message   || "Internal Server Error";
  return res.status(statusCode).json({
    statusCode,
    success: false,
    message,
    errors: err.errors || [],
  });
});

startServer();
(async () => {
  await scheduleStockSimulation();
})();
