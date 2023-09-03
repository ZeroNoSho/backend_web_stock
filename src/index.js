import express from "express";
import { Sequelize } from "sequelize";
import dotenv from "dotenv";
import mysql from "mysql2";
import cors from "cors";
import cookieParser from "cookie-parser";
// import router from "./routes/index.js";

dotenv.config();
const app = express();

const db = new Sequelize(process.env.DB_NAME, process.env.DB_USERNAME, process.env.DB_PASSWORD, {
  host: process.env.DB_HOST,
  dialect: process.env.DB_DIALECT,
  port: process.env.DB_PORT,
  dialectModule: mysql,
  pool: {
    max: 5,
    min: 0,
    idle: 1000,
    handleDisconnects: true,
  },
});

//koneksi
// try {
//   await db.authenticate();
//   console.log("DataBase Connected...");
// } catch (error) {
//   console.error(error);
// }

app.use(
  cors({
    origin: "http://localhost:3000",
    methods: ["GET", "PUT", "POST", "PATCH", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization", "x-csrf-token"],
    credentials: true,
    exposedHeaders: ["*", "Authorization"],
    maxAge: 600,
  })
);

app.get("/", function (req, res) {
  res.json({ nama: "Susscess" });
});

app.use(cookieParser());
app.use(express.json());
// app.use(router);

const PORT = process.env.PORT || 5000;
app.listen(PORT);

export default app;
