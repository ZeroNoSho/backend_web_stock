import Produksi from "../../models/Produksi/index.js";
import { Op } from "sequelize";

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
