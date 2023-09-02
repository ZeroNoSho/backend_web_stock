import { Sequelize } from "sequelize";
import db from "../config/Database.js";

const { DataTypes } = Sequelize;

const BahanBaku = db.define(
  "bahanbaku",
  {
    nama: {
      type: DataTypes.STRING,
    },
    jenis: {
      type: DataTypes.STRING,
    },
    stok: {
      type: DataTypes.INTEGER,
    },
    tipe: {
      type: DataTypes.INTEGER,
    },
  },
  { freezeTableName: true }
);


export default BahanBaku;
