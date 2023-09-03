import { DataBarang } from "../../models/index.js";
import { Op } from "sequelize";

export const getBarang = async (req, res) => {
  try {
    const Databarang = await DataBarang.findAll();
    res.json(Databarang);
  } catch (error) {
    console.error(error);
  }
};

export const setBarang = async (req, res) => {
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

export const updateBarang = async (req, res) => {
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

export const delBarang = async (req, res) => {
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

export const getBarangSerch = async (req, res) => {
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
