// models/transaction.model.ts
import pool from "../config/db";

export interface Transaction {
	id_transaction: number;
	amount: number;
	tip: number;
	created_at: Date;
	updated_at?: Date;
	id_payment_type: number;
	id_cash_register: number;
	id_user: number;
}

export interface TransactionQuery {
	date_from?: Date;
	date_to?: Date;
	payment_type?: number;
	amount_min?: number;
	amount_max?: number;
	user_id?: number;
}

export const findAll = async (
	query?: TransactionQuery,
): Promise<Transaction[]> => {
	let sql = "SELECT * FROM transactions WHERE 1 = 1";
	const params = [];

	if (query) {
		if (query.date_from) {
			params.push(query.date_from);
			sql += ` AND created_at >= $${params.length}`;
		}

		if (query.date_to) {
			params.push(query.date_to);
			sql += ` AND created_at <= $${params.length}`;
		}

		if (query.payment_type) {
			params.push(query.payment_type);
			sql += ` AND id_payment_type = $${params.length}`;
		}

		if (query.amount_min) {
			params.push(query.amount_min);
			sql += ` AND amount >= $${params.length}`;
		}

		if (query.amount_max) {
			params.push(query.amount_max);
			sql += ` AND amount <= $${params.length}`;
		}

		if (query.user_id) {
			params.push(query.user_id);
			sql += ` AND id_user = $${params.length}`;
		}
	}

	const result = await pool.query(sql, params);
	return result.rows;
};

export const findById = async (id: number): Promise<Transaction | null> => {
	const result = await pool.query(
		"SELECT * FROM transactions WHERE id_transaction = $1",
		[id],
	);

	return result.rows[0] || null;
};

export const create = async (
	transaction: Partial<Transaction>,
): Promise<Transaction> => {
	const result = await pool.query(
		`INSERT INTO transactions (amount, tip, created_at, id_payment_type, id_cash_register, id_user)
         VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
		[
			transaction.amount,
			transaction.tip,
			new Date(),
			transaction.id_payment_type,
			transaction.id_cash_register,
			transaction.id_user,
		],
	);
	return result.rows[0];
};

export const update = async (
	id: number,
	transaction: Partial<Transaction>,
): Promise<Transaction> => {
	const result = await pool.query(
		`UPDATE transactions SET
				amount = $1,
				tip = $2,
				updated_at = $3,
				id_payment_type = $4,
				id_cash_register = $5,
				id_user = $6
       WHERE id_transaction = $7
       RETURNING *`,
		[
			transaction.amount,
			transaction.tip,
			new Date(),
			transaction.id_payment_type,
			transaction.id_cash_register,
			transaction.id_user,
			id,
		],
	);

	return result.rows[0];
};

export const remove = async (id: number): Promise<void> => {
	await pool.query("DELETE FROM transactions WHERE id_transaction = $1", [id]);
};
