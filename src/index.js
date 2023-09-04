import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import db from "../config/index.js";
import bcrypt from "bcryptjs";
import { Op } from "sequelize";
import jwt from "jsonwebtoken";
import { BahanBaku, DataBarang, Jenis, Produksi, Transaksi, Users } from "../models/index.js";
import { verifyToken } from "../middleware/index.js";
import * as XLSX from "xlsx/xlsx.mjs";
import * as fs from "fs";
XLSX.set_fs(fs);

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

app.use(cookieParser());
app.use(express.json());

//user;
const getUser = async (req, res) => {
  try {
    const users = await Users.findAll();
    res.json(users);
  } catch (error) {
    console.error(error);
  }
};
const Register = async (req, res) => {
  const { name, password, confpass } = req.body;
  if (password !== confpass) {
    return res.status(400).json({ msg: "password tidak sama dengan confirm" });
  }
  const salt = await bcrypt.genSalt();
  const hashPassword = await bcrypt.hash(password, salt);
  try {
    await Users.create({
      name,
      password: hashPassword,
    });
    res.json({ msg: "ubah password berhasil" });
  } catch (error) {
    console.log(error);
  }
};
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
const refreshToken = async (req, res) => {
  try {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) return res.sendStatus(401);
    const user = await Users.findAll({
      where: {
        refresh_token: refreshToken,
      },
    });
    if (!user[0]) return res.sendStatus(403);
    jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, decode) => {
      if (err) return res.sendStatus(403);
      const userId = user[0].id;
      const name = user[0].name;
      const accessToken = jwt.sign({ userId, name }, process.env.ACCESS_TOKEN_SECRET, {
        expiresIn: "15s",
      });
      res.json({ accessToken });
    });
  } catch (error) {
    console.log(error);
  }
};

//bahan baku
const SetBahanbaku = async (req, res) => {
  const { nama, jenis, stok, harga } = req.body;
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
      harga: harga,
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

  const { nama, jenis, stok, harga } = req.body;
  try {
    await BahanBaku.update(
      { nama: nama, jenis: jenis, stok: stok, harga: harga },
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
  const { nama, jenis, stok, bahan } = req.body;
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
      bahan: bahan,
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

  const { nama, jenis, stok, bahan } = req.body;
  try {
    await DataBarang.update(
      { nama: nama, jenis: jenis, stok: stok, bahan: bahan },
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
const getProduksibakuSerch = async (req, res) => {
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
const setProduksi = async (req, res) => {
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
const updateProduksi = async (req, res) => {
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
const delProduksi = async (req, res) => {
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

//transaksi
const setTransaksiMasuk = async (req, res) => {
  const { nama, tipe, jenis, alur, stok, ket } = req.body;
  try {
    await Transaksi.create({
      nama: nama,
      tipe: tipe,
      jenis: jenis,
      alur: alur,
      stok: stok,
      ket: ket,
    });

    if (tipe == "Barang") {
      const Barang = await DataBarang.findAll({
        where: {
          nama: nama,
        },
      });
      const stock = Barang[0].stok + stok;
      const Idbarang = Barang[0].id;
      await DataBarang.update(
        { stok: stock },
        {
          where: {
            id: Idbarang,
          },
        }
      );
    } else {
      const Bahanbaku = await BahanBaku.findAll({
        where: {
          nama: nama,
        },
      });
      const stock = Bahanbaku[0].stok + stok;
      const Idbarang = Bahanbaku[0].id;
      await BahanBaku.update(
        { stok: stock },
        {
          where: {
            id: Idbarang,
          },
        }
      );
    }

    res.json({ msg: "berhasil menambahkan" });
  } catch (error) {
    console.log(error);
  }
};
const setTransaksiKeluar = async (req, res) => {
  const { nama, tipe, jenis, alur, stok, ket } = req.body;
  const Barang = await DataBarang.findAll({
    where: {
      nama: nama,
    },
  });

  if (Barang[0].stok < stok) return res.json({ msg: "tidak bisa" });

  try {
    await Transaksi.create({
      nama: nama,
      tipe: tipe,
      jenis: jenis,
      alur: alur,
      stok: stok,
      ket: ket,
    });

    const stock = Barang[0].stok - stok;
    const Idbarang = Barang[0].id;
    await DataBarang.update(
      { stok: stock },
      {
        where: {
          id: Idbarang,
        },
      }
    );

    res.json({ msg: "berhasil menambahkan" });
  } catch (error) {
    console.log(error);
  }
};
const updateTransaksi = async (req, res) => {
  const product = await Transaksi.findOne({
    where: {
      id: req.params.id,
    },
  });

  if (!product) return res.status(404).json({ msg: "No data" });

  const { nama, tipe, jenis, alur, stok, ket } = req.body;

  try {
    if (product.tipe == "Barang" && product.alur == "masuk") {
      const Barang = await DataBarang.findAll({
        where: {
          nama: product.nama,
        },
      });
      const stock = Barang[0].stok - product.stok + stok;
      const Idbarang = Barang[0].id;
      await DataBarang.update(
        { stok: stock },
        {
          where: {
            id: Idbarang,
          },
        }
      );
    }

    if (product.tipe == "Barang" && product.alur == "keluar") {
      const Barang = await DataBarang.findAll({
        where: {
          nama: product.nama,
        },
      });
      const stock = Barang[0].stok + product.stok - stok;
      const Idbarang = Barang[0].id;
      await DataBarang.update(
        { stok: stock },
        {
          where: {
            id: Idbarang,
          },
        }
      );
    }

    if (product.tipe == "Bahan" && product.alur == "masuk") {
      const Barang = await BahanBaku.findAll({
        where: {
          nama: product.nama,
        },
      });
      const stock = Barang[0].stok - product.stok + stok;
      const Idbarang = Barang[0].id;
      await BahanBaku.update(
        { stok: stock },
        {
          where: {
            id: Idbarang,
          },
        }
      );
    }

    await Transaksi.update(
      { nama: nama, tipe: tipe, jenis: jenis, alur: alur, stok: stok, ket: ket },
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
const delTransaksi = async (req, res) => {
  const product = await Transaksi.findOne({
    where: {
      id: req.params.id,
    },
  });

  if (!product) return res.json({ msg: "No data" });

  try {
    if (product.tipe == "Barang" && product.alur == "masuk") {
      const Barang = await DataBarang.findAll({
        where: {
          nama: product.nama,
        },
      });
      const stock = Barang[0].stok - product.stok;
      const Idbarang = Barang[0].id;
      await DataBarang.update(
        { stok: stock },
        {
          where: {
            id: Idbarang,
          },
        }
      );
    }
    if (product.tipe == "Barang" && product.alur == "keluar") {
      const Barang = await DataBarang.findAll({
        where: {
          nama: product.nama,
        },
      });
      const stock = Barang[0].stok + product.stok;
      const Idbarang = Barang[0].id;
      await DataBarang.update(
        { stok: stock },
        {
          where: {
            id: Idbarang,
          },
        }
      );
    }
    if (product.tipe == "Bahan" && product.alur == "masuk") {
      const Barang = await BahanBaku.findAll({
        where: {
          nama: product.nama,
        },
      });
      const stock = Barang[0].stok - product.stok;
      const Idbarang = Barang[0].id;
      await BahanBaku.update(
        { stok: stock },
        {
          where: {
            id: Idbarang,
          },
        }
      );
    }

    await Transaksi.destroy({
      where: {
        id: req.params.id,
      },
    });
    res.status(200).json({ msg: "berhasil di hapus" });
  } catch (error) {
    console.log(error.message);
  }
};
const getTransaksiSerch = async (req, res) => {
  const page = parseInt(req.query.page) || 0;
  const limit = parseInt(req.query.limit) || 10;
  const search = req.query.search_query || "";
  const offset = limit * page;
  const masuk = await Transaksi.findAll({
    where: {
      alur: "masuk",
    },
  });
  const keluar = await Transaksi.findAll({
    where: {
      alur: "keluar",
    },
  });

  const totalRows = await Transaksi.count({
    where: {
      [Op.or]: [
        {
          nama: {
            [Op.like]: "%" + search + "%",
          },
        },
        {
          alur: {
            [Op.like]: "%" + search + "%",
          },
        },
        {
          tipe: {
            [Op.like]: "%" + search + "%",
          },
        },
      ],
    },
  });

  const totalPage = Math.ceil(totalRows / limit);

  const result = await Transaksi.findAll({
    where: {
      [Op.or]: [
        {
          nama: {
            [Op.like]: "%" + search + "%",
          },
        },
        {
          alur: {
            [Op.like]: "%" + search + "%",
          },
        },
        {
          tipe: {
            [Op.like]: "%" + search + "%",
          },
        },
      ],
    },
    offset: offset,
    limit: limit,
  });

  res.json({
    result: result,
    page: page,
    limit: limit,
    totalRows: totalRows,
    totalPage: totalPage,
    masuk: masuk,
    keluar: keluar,
  });
};
const getTransaksiExel = async (req, res) => {
  const transaksi = await Transaksi.findAll();
  const heading = [["nama", "tipe", "jenis", "alur", "stok", "ket", "createdAt", "updatedAt"]];
  const multiDimensionalArray = transaksi.map((obj) => [obj.nama, obj.tipe, obj.jenis, obj.alur, obj.stok, obj.ket, obj.createdAt.toString(), obj.updatedAt.toString()]);

  const workbook = XLSX.utils.book_new();
  const worksheet = XLSX.utils.aoa_to_sheet(multiDimensionalArray);

  XLSX.utils.sheet_add_aoa(worksheet, heading);
  XLSX.utils.book_append_sheet(workbook, worksheet, "books");

  const buffer = XLSX.write(workbook, { bookType: "xlsx", type: "buffer" });
  res.attachment("TransaksiData.xlsx");
  return res.send(buffer);
};

//pembelian
const getPembelian = async (req, res) => {
  const number = parseInt(req.query.limit) || 100;
  try {
    const Barang = await DataBarang.findAll();
    const Bahan = await BahanBaku.findAll();
    const arrayall = [...Bahan, ...Barang];
    const all = [];

    arrayall.forEach((item) => {
      if (item.stok <= number) {
        all.push(item);
      }
    });

    res.json(all);
  } catch (error) {
    console.error(error);
  }
};
const getPembeliansrch = async (req, res) => {
  const search = req.query.search_query || "";
  const Barang = await DataBarang.findAll();

  const Bahan = await BahanBaku.findAll();

  const arrayall = [...Bahan, ...Barang];

  const searchResults = arrayall.filter((item) => item.nama.includes(search));

  res.json(searchResults);
};
const getPembelianExel = async (req, res) => {
  const Barang = await DataBarang.findAll();
  const Bahan = await BahanBaku.findAll();

  const arrayall = [...Bahan, ...Barang];
  const heading = [["Nama Barang / Bahan", " satuan", "stok", "tipe", "createdAt", "updatedAt"]];

  const multiDimensionalArray = arrayall.map((obj) => [obj.nama, obj.jenis, obj.stok, obj.tipe, obj.createdAt.toString(), obj.updatedAt.toString()]);

  const workbook = XLSX.utils.book_new();
  const worksheet = XLSX.utils.aoa_to_sheet(multiDimensionalArray);

  XLSX.utils.sheet_add_aoa(worksheet, heading);
  XLSX.utils.book_append_sheet(workbook, worksheet, "books");

  const buffer = XLSX.write(workbook, { bookType: "xlsx", type: "buffer" });
  res.attachment("PersedianData.xlsx");
  return res.send(buffer);
};

app.get("/", function (req, res) {
  res.json({ nama: "Susscess" });
});

app.get("/users", verifyToken, getUser);
app.post("/users", Register);
app.post("/login", Login);
app.get("/token", refreshToken);
app.delete("/logout", Logout);

app.post("/Barang", verifyToken, setBarang);
app.patch("/Barang/:id", verifyToken, updateBarang);
app.delete("/Barang/:id", verifyToken, delBarang);
app.get("/Barang/serch", verifyToken, getBarangSerch);

app.post("/Bahanbaku", verifyToken, SetBahanbaku);
app.patch("/Bahanbaku/:id", verifyToken, UpdateBahanbaku);
app.delete("/Bahanbaku/:id", verifyToken, DelBahanbaku);
app.get("/Bahanbaku/serch", verifyToken, GetBahanbakuSerch);

app.post("/Jenis", verifyToken, setJenis);
app.patch("/Jenis/:id", verifyToken, updateJenis);
app.delete("/Jenis/:id", verifyToken, delJenis);
app.get("/Jenis/serch", verifyToken, getJenisSerch);

app.get("/Produksi/serch", verifyToken, getProduksibakuSerch);
app.post("/Produksi", verifyToken, setProduksi);
app.delete("/Produksi/:id", verifyToken, delProduksi);
app.patch("/Produksi/:id", verifyToken, updateProduksi);

app.post("/Transaksi/Masuk", verifyToken, setTransaksiMasuk);
app.post("/Transaksi/Keluar", verifyToken, setTransaksiKeluar);
app.patch("/Transaksi/:id", verifyToken, updateTransaksi);
app.delete("/Transaksi/:id", verifyToken, delTransaksi);
app.get("/Transaksi/serch", verifyToken, getTransaksiSerch);
app.get("/Transaksi/exel", getTransaksiExel);

app.get("/Pembelian", verifyToken, getPembelian);
app.get("/Pembelian/serch", verifyToken, getPembeliansrch);
app.get("/Pembelian/exel", getPembelianExel);

const PORT = process.env.PORT || 5000;
app.listen(PORT);

export default app;
