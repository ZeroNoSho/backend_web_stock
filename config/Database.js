import { Sequelize } from "sequelize";
import dotenv from "dotenv";
import mysql from "mysql2";
dotenv.config();
let sequelize = null;

const db = new Sequelize(process.env.DB_NAME, process.env.DB_USERNAME, process.env.DB_PASSWORD, {
  host: process.env.DB_HOST,
  dialect: process.env.DB_DIALECT,
  port: process.env.DB_PORT,
  dialectModule: mysql,
  pool: {
    max: 5,
    min: 0,
    idle: 1000,
    handleDisconnects: true,
  },
});

export default db;
