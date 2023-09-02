import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import db from "./config/Database.js";
import router from "./routes/index.js";

dotenv.config();
const app = express();

//koneksi
try {
  await db.authenticate();
  console.log("DataBase Connected...");
} catch (error) {
  console.error(error);
}

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
app.use(router);

const PORT = process.env.PORT || 5000;
app.listen(PORT);
