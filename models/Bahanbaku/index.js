import { Sequelize } from "sequelize";
import db from "../../config/index.js";

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
      type: DataTypes.STRING,
    },
    harga: {
      type: DataTypes.INTEGER,
    },
    biayapesan: {
      type: DataTypes.INTEGER,
    },
    biayapenyimpanan: {
      type: DataTypes.INTEGER,
    },
    ukuran: {
      type: DataTypes.INTEGER,
    },
    kebutuhan: {
      type: DataTypes.INTEGER,
    },
  },
  { freezeTableName: true }
);

export default BahanBaku;
