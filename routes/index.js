import express from "express";
import { Login, Logout, Register, getUser } from "../controllers/users/index.js";
import { verifyToken } from "../middleware/verifyToken.js";
import { refreshToken } from "../controllers/refrshtoken/index.js";
import { delJenis, getJenisSerch, setJenis, updateJenis } from "../controllers/jenis/index.js";
import { delBarang, getBarangSerch, setBarang, updateBarang } from "../controllers/databarang/index.js";
import { delBahanbaku, getBahanbakuSerch, setBahanbaku, updateBahanbaku } from "../controllers/bahanbaku/index.js";
import { delTransaksi, getTransaksiExel, getTransaksiSerch, setTransaksiKeluar, setTransaksiMasuk, updateTransaksi } from "../controllers/transaksi/index.js";
import { getPembelian, getPembelianExel, getPembeliansrch } from "../controllers/rpembelian/index.js";
import { delProduksi, getProduksibakuSerch, setProduksi, updateProduksi } from "../controllers/produksi/index.js";

const router = express.Router();

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

export default router;
