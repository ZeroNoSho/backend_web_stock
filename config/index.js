import { Sequelize } from "sequelize";
import dotenv from "dotenv";
dotenv.config();

const db = new Sequelize(process.env.DB_NAME || "sql12643768", process.env.DB_USERNAME || "sql12643768", process.env.DB_PASSWORD || "yvYE3d1GFT", {
  host: process.env.DB_HOST || "sql12.freesqldatabase.com",
  dialect: process.env.DB_DIALECT || "mysql",
  port: process.env.DB_PORT,
  pool: {
    max: 5,
    min: 0,
    idle: 1000,
    handleDisconnects: true,
  },
});

export default db;
