import { Pool } from "pg";
import logger from "./logger";

// DATABASE_URL is provided by Render (and other PaaS). Individual vars are used locally.
const pool = process.env.DATABASE_URL
  ? new Pool({
      connectionString: process.env.DATABASE_URL,
      ssl: { rejectUnauthorized: false },
    })
  : new Pool({
      user: process.env.DB_USER,
      host: process.env.DB_HOST,
      database: process.env.DB_NAME,
      password: process.env.DB_PASS,
      port: Number.parseInt(process.env.DB_PORT || "5432", 10),
    });

pool
  .query("SELECT NOW()")
  .then((result) => {
    logger.info("Connected to database", { time: result.rows[0].now });
  })
  .catch((err) => {
    logger.error("Database connection failed", { error: err.message });
  });

export default pool;
