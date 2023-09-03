import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import db from "../config/index.js";
import { Op } from "sequelize";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { BahanBaku, DataBarang, Jenis, Produksi, Transaksi, Users } from "../models/index.js";
// import router from "../routes/index.js";

dotenv.config();
const app = express();

//koneksi
try {
  await db.authenticate();
  console.log("DataBase Connected...");
} catch (error) {
  console.error(error);
}

//bahan baku
const Login = async (req, res) => {
  try {
    const user = await Users.findOne({
      where: {
        name: req.body.name,
      },
    });

    const match = await bcrypt.compare(req.body.password, user.password);
    if (!match) return res.status(400).json({ msg: "Wrong Password" });
    const UserId = user.id;
    const name = user.name;

    const accessToken = jwt.sign({ UserId, name }, process.env.ACCESS_TOKEN_SECRET, {
      expiresIn: "20s",
    });
    const refreshToken = jwt.sign({ UserId, name }, process.env.REFRESH_TOKEN_SECRET, {
      expiresIn: "1d",
    });
    await Users.update(
      { refresh_token: refreshToken },
      {
        where: {
          id: UserId,
        },
      }
    );

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000, // Mengubah maxAge menjadi detik
      secure: true, // set to true if your using https or samesite is none
      sameSite: "none",
    });

    res.json({ accessToken });
  } catch (error) {
    res.status(404).json({ msg: "user saalah" });
  }
};
const Logout = async (req, res) => {
  const refreshToken = req.cookies.refreshToken;
  if (!refreshToken) return res.sendStatus(204);
  const user = await Users.findAll({
    where: {
      refresh_token: refreshToken,
    },
  });
  if (!user[0]) return res.sendStatus(204);
  const useId = user[0].id;
  await Users.update(
    { refresh_token: null },
    {
      where: {
        id: useId,
      },
    }
  );
  res.clearCookie("refreshToken");
  return res.sendStatus(200);
};

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

app.post("/login", Login);
app.delete("/logout", Logout);

app.use(cookieParser());
app.use(express.json());
// app.use(router);

const PORT = process.env.PORT || 5000;
app.listen(PORT);

export default app;
