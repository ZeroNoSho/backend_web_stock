import { Sequelize } from "sequelize";
import db from "../config/Database.js";

const { DataTypes } = Sequelize;

const Produksi = db.define(
  "produksi",
  {
    nama: {
      type: DataTypes.STRING,
    },
    jumlah: {
      type: DataTypes.INTEGER,
    },
    jenis: {
      type: DataTypes.STRING,
    },
  },
  { freezeTableName: true }
);

export default Produksi;
