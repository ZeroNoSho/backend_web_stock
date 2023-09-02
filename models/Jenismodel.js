import { Sequelize } from "sequelize";
import db from "../config/database.js";

const { DataTypes } = Sequelize;

const Jenis = db.define(
  "jenis",
  {
    jenis: {
      type: DataTypes.STRING,
    },
  },
  { freezeTableName: true }
);

export default Jenis;
