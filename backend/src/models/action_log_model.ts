import pool from "../config/db";

export type ActionLogType = "AUTH" | "CASH" | "TRANSACTION" | "USER" | "SYSTEM";

export interface ActionLog {
  id_log: number;
  action_type: ActionLogType;
  action: string;
  details?: object;
  created_at: Date;
  id_user?: number;
  first_name?: string;
  last_name?: string;
}

/** Inserts an action log entry. Fire-and-forget — does not throw. */
export const insert = async (
  action_type: ActionLogType,
  action: string,
  id_user?: number,
  details?: object,
): Promise<void> => {
  try {
    await pool.query(
      "INSERT INTO action_logs (action_type, action, details, id_user) VALUES ($1, $2, $3, $4)",
      [
        action_type,
        action,
        details ? JSON.stringify(details) : null,
        id_user ?? null,
      ],
    );
  } catch {
    // Non-blocking: log failure must not break the main flow
  }
};

export interface ActionLogFilters {
  type?: string;
  date_from?: Date;
  date_to?: Date;
  page?: number;
  limit?: number;
}

export const findAll = async (
  filters?: ActionLogFilters,
): Promise<{ data: ActionLog[]; total: number }> => {
  let countSql = "SELECT COUNT(*) FROM action_logs al WHERE 1=1";
  let sql =
    "SELECT al.*, u.first_name, u.last_name FROM action_logs al LEFT JOIN users u ON al.id_user = u.id_user WHERE 1=1";
  const params: unknown[] = [];

  if (filters?.type) {
    params.push(filters.type);
    const clause = ` AND al.action_type = $${params.length}`;
    sql += clause;
    countSql += clause;
  }
  if (filters?.date_from) {
    params.push(filters.date_from);
    const clause = ` AND al.created_at >= $${params.length}`;
    sql += clause;
    countSql += clause;
  }
  if (filters?.date_to) {
    params.push(filters.date_to);
    const clause = ` AND al.created_at <= $${params.length}`;
    sql += clause;
    countSql += clause;
  }

  const countResult = await pool.query(countSql, params);
  const total = Number(countResult.rows[0].count);

  sql += " ORDER BY al.created_at DESC";
  const page = filters?.page ?? 1;
  const limit = filters?.limit ?? 50;
  params.push(limit);
  sql += ` LIMIT $${params.length}`;
  params.push((page - 1) * limit);
  sql += ` OFFSET $${params.length}`;

  const result = await pool.query(sql, params);
  return { data: result.rows, total };
};
