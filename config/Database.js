import { Sequelize } from "sequelize";

const db = new Sequelize("sql12643768" || process.env.DB, "sql12643768" || process.env.USER, "yvYE3d1GFT" || process.env.PASS, {
  host: "sql12.freesqldatabase.com" || process.env.HOST,
  dialect: "mysql",
});

export default db;
