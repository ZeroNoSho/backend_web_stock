import Transaksi from "../../models/Transaksi/index.js";
import DataBarang from "../../models/Databarang/index.js";
import BahanBaku from "../../models/Bahanbaku/index.js";
import { Op } from "sequelize";
import * as XLSX from "xlsx/xlsx.mjs";
import * as fs from "fs";
XLSX.set_fs(fs);

export const setTransaksiMasuk = async (req, res) => {
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

export const setTransaksiKeluar = async (req, res) => {
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

export const updateTransaksi = async (req, res) => {
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

export const delTransaksi = async (req, res) => {
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

export const getTransaksiSerch = async (req, res) => {
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

export const getTransaksiExel = async (req, res) => {
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
