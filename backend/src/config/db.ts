// backend/src/db.ts
import { Pool } from "pg";

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASS,
  port: Number.parseInt(process.env.DB_PORT || "5432"),
});

pool.query("SELECT NOW()", (err, result) => {
  if (err) {
    console.error("Erreur de connexion à la base de données :", err);
  } else {
    console.log("Connecté à la base de données !", result.rows[0].now);
  }
});

export default pool;
