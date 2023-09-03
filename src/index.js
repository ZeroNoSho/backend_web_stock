import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import db from "../config/index.js";
import { Op } from "sequelize";
import { BahanBaku } from "../models/index.js";
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
const setBahanbaku = async (req, res) => {
  const { nama, jenis, stok } = req.body;
  const product = await BahanBaku.findOne({
    where: {
      nama: nama,
    },
  });
  if (product) return res.json({ msg: "sudah ada" });

  try {
    await BahanBaku.create({
      nama: nama,
      jenis: jenis,
      stok: stok,
      tipe: "Bahan",
    });
    res.json({ msg: "berhasil menambahkan" });
  } catch (error) {
    console.log(error);
  }
};

const updateBahanbaku = async (req, res) => {
  const product = await BahanBaku.findOne({
    where: {
      id: req.params.id,
    },
  });
  if (!product) return res.status(404).json({ msg: "No data" });

  const { nama, jenis, stok } = req.body;
  try {
    await BahanBaku.update(
      { nama: nama, jenis: jenis, stok: stok },
      {
        where: {
          id: req.params.id,
        },
      }
    );
    res.status(200).json({ msg: "berhasil di update" });
  } catch (error) {
    console.log(error.message);
  }
};

const delBahanbaku = async (req, res) => {
  const product = await BahanBaku.findOne({
    where: {
      id: req.params.id,
    },
  });
  if (!product) return res.status(404).json({ msg: "No data" });
  try {
    await BahanBaku.destroy({
      where: {
        id: req.params.id,
      },
    });
    res.status(200).json({ msg: "berhasil di hapus" });
  } catch (error) {
    console.log(error.message);
  }
};

const getBahanbakuSerch = async (req, res) => {
  const search = req.query.search_query || "";
  const result = await BahanBaku.findAll({
    where: {
      [Op.or]: [
        {
          nama: {
            [Op.like]: "%" + search + "%",
          },
        },
      ],
    },
  });
  res.json({
    result: result,
  });
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

app.post("/Bahanbaku", setBahanbaku);
app.patch("/Bahanbaku/:id", updateBahanbaku);
app.delete("/Bahanbaku/:id", delBahanbaku);
app.get("/Bahanbaku/serch", getBahanbakuSerch);

app.use(cookieParser());
app.use(express.json());
// app.use(router);

const PORT = process.env.PORT || 5000;
app.listen(PORT);

export default app;
