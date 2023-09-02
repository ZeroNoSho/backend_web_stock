import Jenis from "../models/Jenismodel.js";
import { Op } from "sequelize";

export const getJenis = async (req, res) => {
  try {
    const jenis = await Jenis.findAll();
    res.json(jenis);
  } catch (error) {
    console.error(error);
  }
};

export const setJenis = async (req, res) => {
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

export const updateJenis = async (req, res) => {
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

export const delJenis = async (req, res) => {
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

export const getJenisSerch = async (req, res) => {
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
