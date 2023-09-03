import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import db from "../config/index.js";
import { Op } from "sequelize";
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

//bahan
const SetBahanbaku = async (req, res) => {
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
const UpdateBahanbaku = async (req, res) => {
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
const DelBahanbaku = async (req, res) => {
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
const GetBahanbakuSerch = async (req, res) => {
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

//barang
const setBarang = async (req, res) => {
  const { nama, jenis, stok } = req.body;
  const product = await DataBarang.findOne({
    where: {
      nama: nama,
    },
  });
  if (product) return res.json({ msg: "sudah ada" });

  try {
    await DataBarang.create({
      nama: nama,
      jenis: jenis,
      stok: stok,
      tipe: "Barang",
    });
    res.json({ msg: "berhasil menambahkan" });
  } catch (error) {
    console.log(error);
  }
};
const updateBarang = async (req, res) => {
  const product = await DataBarang.findOne({
    where: {
      id: req.params.id,
    },
  });
  if (!product) return res.status(404).json({ msg: "No data" });

  const { nama, jenis, stok } = req.body;
  try {
    await DataBarang.update(
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
const delBarang = async (req, res) => {
  const product = await DataBarang.findOne({
    where: {
      id: req.params.id,
    },
  });
  if (!product) return res.status(404).json({ msg: "No data" });
  try {
    await DataBarang.destroy({
      where: {
        id: req.params.id,
      },
    });
    res.status(200).json({ msg: "berhasil di hapus" });
  } catch (error) {
    console.log(error.message);
  }
};
const getBarangSerch = async (req, res) => {
  const search = req.query.search_query || "";
  const result = await DataBarang.findAll({
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

//jenis
const setJenis = async (req, res) => {
  const jenis = req.body.jenis;
  const product = await Jenis.findOne({
    where: {
      jenis: jenis,
    },
  });

  if (product) return res.json({ msg: "sudah ada" });

  try {
    await Jenis.create({
      jenis: jenis,
    });
    res.json({ msg: "berhasil menambahkan" });
  } catch (error) {
    console.log(error);
  }
};
const updateJenis = async (req, res) => {
  const product = await Jenis.findOne({
    where: {
      id: req.params.id,
    },
  });
  if (!product) return res.status(404).json({ msg: "No data" });

  const jenis = req.body.jenis;
  try {
    await Jenis.update(
      { jenis: jenis },
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
const delJenis = async (req, res) => {
  const product = await Jenis.findOne({
    where: {
      id: req.params.id,
    },
  });
  if (!product) return res.status(404).json({ msg: "No data" });
  try {
    await Jenis.destroy({
      where: {
        id: req.params.id,
      },
    });
    res.status(200).json({ msg: "berhasil di hapus" });
  } catch (error) {
    console.log(error.message);
  }
};
const getJenisSerch = async (req, res) => {
  const search = req.query.search_query || "";
  const result = await Jenis.findAll({
    where: {
      [Op.or]: [
        {
          jenis: {
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

//produksi
export const getProduksibakuSerch = async (req, res) => {
  const search = req.query.search_query || "";
  const result = await Produksi.findAll({
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
export const setProduksi = async (req, res) => {
  const { nama, jenis, jumlah } = req.body;
  try {
    await Produksi.create({
      nama: nama,
      jumlah: jumlah,
      jenis: jenis,
    });

    res.json({ msg: "berhasil menambahkan" });
  } catch (error) {
    console.log(error);
  }
};
export const updateProduksi = async (req, res) => {
  const product = await Produksi.findOne({
    where: {
      id: req.params.id,
    },
  });
  if (!product) return res.status(404).json({ msg: "No data" });

  const { nama, jenis, jumlah } = req.body;
  try {
    await Produksi.update(
      {
        nama: nama,
        jumlah: jumlah,
        jenis: jenis,
      },
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
export const delProduksi = async (req, res) => {
  const product = await Produksi.findOne({
    where: {
      id: req.params.id,
    },
  });
  if (!product) return res.status(404).json({ msg: "No data" });
  try {
    await Produksi.destroy({
      where: {
        id: req.params.id,
      },
    });
    res.status(200).json({ msg: "berhasil di hapus" });
  } catch (error) {
    console.log(error.message);
  }
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

app.post("/Barang", setBarang);
app.patch("/Barang/:id", updateBarang);
app.delete("/Barang/:id", delBarang);
app.get("/Barang/serch", getBarangSerch);

app.post("/Bahanbaku", SetBahanbaku);
app.patch("/Bahanbaku/:id", UpdateBahanbaku);
app.delete("/Bahanbaku/:id", DelBahanbaku);
app.get("/Bahanbaku/serch", GetBahanbakuSerch);

app.post("/Jenis", setJenis);
app.patch("/Jenis/:id", updateJenis);
app.delete("/Jenis/:id", delJenis);
app.get("/Jenis/serch", getJenisSerch);

app.get("/Produksi/serch", getProduksibakuSerch);
app.post("/Produksi", setProduksi);
app.delete("/Produksi/:id", delProduksi);
app.patch("/Produksi/:id", updateProduksi);

app.use(cookieParser());
app.use(express.json());
// app.use(router);

const PORT = process.env.PORT || 5000;
app.listen(PORT);

export default app;
