import mysql from "mysql2";
import dotenv from "dotenv";

dotenv.config();
const db = mysql.createPool({
  host: process.env.HOST,
  user: process.env.USER,
  password: process.env.PASS,
  database: process.env.DB,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

db.getConnection((err, conn) => {
  if (err) console.log(err);
  console.log("Connected successfully");
});

export default db;
