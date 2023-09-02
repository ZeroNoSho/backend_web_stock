import { Sequelize } from "sequelize";
import dotenv from "dotenv";

dotenv.config();
const db = new Sequelize(process.env.DB, process.env.USER, process.env.PASS, {
  host: process.env.HOST,
  dialect: "mysql",
});

export default db;
