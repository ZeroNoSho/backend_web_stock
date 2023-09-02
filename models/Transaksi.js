import { Sequelize } from "sequelize";
import db from "../config/Database.js";

const { DataTypes } = Sequelize;

const Transaksi = db.define(
  "transaksi",
  {
    nama: {
      type: DataTypes.STRING,
    },
    tipe: {
      type: DataTypes.STRING,
    },
    jenis: {
      type: DataTypes.STRING,
    },
    alur: {
      type: DataTypes.STRING,
    },
    stok: {
      type: DataTypes.INTEGER,
    },
    ket: {
      type: DataTypes.STRING,
    },
  },
  { freezeTableName: true }
);

export default Transaksi;
