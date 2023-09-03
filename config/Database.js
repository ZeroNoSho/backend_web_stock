import { Sequelize } from "sequelize";
import dotenv from "dotenv";
import mysql from "mysql2";

dotenv.config();
const db = new Sequelize(process.env.DB, process.env.USER, process.env.PASS, {
  host: process.env.HOST,
  dialect: process.env.DIALECT,
  dialectModule: mysql,
  pool: {
    max: 5,
    min: 0,
    idle: 1000,
    handleDisconnects: true,
  },
});

export default db;
