import { Pool } from "pg";
import logger from "./logger";

const pool = new Pool({
	user: process.env.DB_USER,
	host: process.env.DB_HOST,
	database: process.env.DB_NAME,
	password: process.env.DB_PASS,
	port: Number.parseInt(process.env.DB_PORT || "5432"),
});

pool.query("SELECT NOW()")
	.then((result) => {
		logger.info("Connected to database", { time: result.rows[0].now });
	})
	.catch((err) => {
		logger.error("Database connection failed", { error: err.message });
	});

export default pool;
