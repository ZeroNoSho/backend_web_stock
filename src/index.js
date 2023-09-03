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
const router = express.Router();

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
router.get("/users", verifyToken, getUser);
router.post("/users", Register);
router.post("/login", Login);
router.get("/token", refreshToken);
router.delete("/logout", Logout);

//master jenis
router.post("/Jenis", verifyToken, setJenis);
router.patch("/Jenis/:id", verifyToken, updateJenis);
router.delete("/Jenis/:id", verifyToken, delJenis);
router.get("/Jenis/serch", verifyToken, getJenisSerch);

//master data barang
router.post("/Barang", verifyToken, setBarang);
router.patch("/Barang/:id", verifyToken, updateBarang);
router.delete("/Barang/:id", verifyToken, delBarang);
router.get("/Barang/serch", verifyToken, getBarangSerch);

//menu bahan baku
router.post("/Bahanbaku", verifyToken, setBahanbaku);
router.patch("/Bahanbaku/:id", verifyToken, updateBahanbaku);
router.delete("/Bahanbaku/:id", verifyToken, delBahanbaku);
router.get("/Bahanbaku/serch", verifyToken, getBahanbakuSerch);

//produksi
router.get("/Produksi/serch", verifyToken, getProduksibakuSerch);
router.post("/Produksi", verifyToken, setProduksi);
router.delete("/Produksi/:id", verifyToken, delProduksi);
router.patch("/Produksi/:id", verifyToken, updateProduksi);

//transaksi Masuk
router.post("/Transaksi/Masuk", verifyToken, setTransaksiMasuk);
router.post("/Transaksi/Keluar", verifyToken, setTransaksiKeluar);
router.patch("/Transaksi/:id", updateTransaksi);
router.delete("/Transaksi/:id", verifyToken, delTransaksi);
router.get("/Transaksi/serch", verifyToken, getTransaksiSerch);
router.get("/Transaksi/exel", getTransaksiExel);

//Rencana Pembelian
router.get("/Pembelian", verifyToken, getPembelian);
router.get("/Pembelian/serch", verifyToken, getPembeliansrch);
router.get("/Pembelian/exel", getPembelianExel);

const PORT = process.env.PORT || 5000;
app.listen(PORT);

export default app;
