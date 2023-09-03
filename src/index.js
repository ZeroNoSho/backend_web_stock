import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import db from "../config/index.js";
import { verifyToken } from "../middleware/index.js";
import {
  Login,
  Logout,
  Register,
  getUser,
  delTransaksi,
  getTransaksiExel,
  getTransaksiSerch,
  setTransaksiKeluar,
  setTransaksiMasuk,
  updateTransaksi,
  refreshToken,
  delJenis,
  getJenisSerch,
  setJenis,
  updateJenis,
  delBarang,
  getBarangSerch,
  setBarang,
  updateBarang,
  delBahanbaku,
  getBahanbakuSerch,
  setBahanbaku,
  updateBahanbaku,
  getPembelian,
  getPembelianExel,
  getPembeliansrch,
  delProduksi,
  getProduksibakuSerch,
  setProduksi,
  updateProduksi,
} from "../controllers/index.js";

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

//login
app.get("/users", verifyToken, getUser);
app.post("/users", Register);
app.post("/login", Login);
app.get("/token", refreshToken);
app.delete("/logout", Logout);

//master jenis
app.post("/Jenis", verifyToken, setJenis);
app.patch("/Jenis/:id", verifyToken, updateJenis);
app.delete("/Jenis/:id", verifyToken, delJenis);
app.get("/Jenis/serch", verifyToken, getJenisSerch);

//master data barang
app.post("/Barang", verifyToken, setBarang);
app.patch("/Barang/:id", verifyToken, updateBarang);
app.delete("/Barang/:id", verifyToken, delBarang);
app.get("/Barang/serch", verifyToken, getBarangSerch);

//menu bahan baku
app.post("/Bahanbaku", verifyToken, setBahanbaku);
app.patch("/Bahanbaku/:id", verifyToken, updateBahanbaku);
app.delete("/Bahanbaku/:id", verifyToken, delBahanbaku);
app.get("/Bahanbaku/serch", verifyToken, getBahanbakuSerch);

//produksi
app.get("/Produksi/serch", verifyToken, getProduksibakuSerch);
app.post("/Produksi", verifyToken, setProduksi);
app.delete("/Produksi/:id", verifyToken, delProduksi);
app.patch("/Produksi/:id", verifyToken, updateProduksi);

//transaksi Masuk
app.post("/Transaksi/Masuk", verifyToken, setTransaksiMasuk);
app.post("/Transaksi/Keluar", verifyToken, setTransaksiKeluar);
app.patch("/Transaksi/:id", updateTransaksi);
app.delete("/Transaksi/:id", verifyToken, delTransaksi);
app.get("/Transaksi/serch", verifyToken, getTransaksiSerch);
app.get("/Transaksi/exel", getTransaksiExel);

//Rencana Pembelian
app.get("/Pembelian", verifyToken, getPembelian);
app.get("/Pembelian/serch", verifyToken, getPembeliansrch);
app.get("/Pembelian/exel", getPembelianExel);

const PORT = process.env.PORT || 5000;
app.listen(PORT);

export default app;
