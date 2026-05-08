import { DEFAULT_PAGE_LIMIT } from "../config/constants";
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
  page?: number;
  limit?: number;
}

/**
 * Retrieves a paginated and filtered list of transactions.
 * @param query - Optional filters (date range, payment type, amount range, user, pagination)
 * @returns Paginated result with transaction data and total count
 */
export const findAll = async (
  query?: TransactionQuery,
): Promise<{
  data: Transaction[];
  total: number;
  page: number;
  limit: number;
}> => {
  let countSql = "SELECT COUNT(*) FROM transactions WHERE 1 = 1";
  let sql = "SELECT * FROM transactions WHERE 1 = 1";
  const params: unknown[] = [];

  if (query) {
    if (query.date_from) {
      params.push(query.date_from);
      const clause = ` AND created_at >= $${params.length}`;
      sql += clause;
      countSql += clause;
    }
    if (query.date_to) {
      params.push(query.date_to);
      const clause = ` AND created_at <= $${params.length}`;
      sql += clause;
      countSql += clause;
    }
    if (query.payment_type) {
      params.push(query.payment_type);
      const clause = ` AND id_payment_type = $${params.length}`;
      sql += clause;
      countSql += clause;
    }
    if (query.amount_min) {
      params.push(query.amount_min);
      const clause = ` AND amount >= $${params.length}`;
      sql += clause;
      countSql += clause;
    }
    if (query.amount_max) {
      params.push(query.amount_max);
      const clause = ` AND amount <= $${params.length}`;
      sql += clause;
      countSql += clause;
    }
    if (query.user_id) {
      params.push(query.user_id);
      const clause = ` AND id_user = $${params.length}`;
      sql += clause;
      countSql += clause;
    }
  }

  const countResult = await pool.query(countSql, params);
  const total = Number(countResult.rows[0].count);

  const page = query?.page ?? 1;
  const limit = query?.limit ?? DEFAULT_PAGE_LIMIT;
  const offset = (page - 1) * limit;

  sql += ` ORDER BY created_at DESC`;
  params.push(limit);
  sql += ` LIMIT $${params.length}`;
  params.push(offset);
  sql += ` OFFSET $${params.length}`;

  const result = await pool.query(sql, params);
  return { data: result.rows, total, page, limit };
};

/**
 * Finds a transaction by its ID.
 * @param id - The transaction ID
 * @returns The transaction object, or null if not found
 */
export const findById = async (id: number): Promise<Transaction | null> => {
  const result = await pool.query(
    "SELECT * FROM transactions WHERE id_transaction = $1",
    [id],
  );
  return result.rows[0] || null;
};

/**
 * Inserts a new transaction into the database with the current timestamp.
 * @param transaction - Partial transaction object with required fields
 * @returns The newly created transaction
 */
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

/**
 * Updates an existing transaction and sets updated_at to the current timestamp.
 * @param id - The transaction ID to update
 * @param transaction - Partial transaction object with fields to update
 * @returns The updated transaction
 */
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

/**
 * Deletes a transaction from the database.
 * @param id - The transaction ID to delete
 */
export const remove = async (id: number): Promise<void> => {
  await pool.query("DELETE FROM transactions WHERE id_transaction = $1", [id]);
};
