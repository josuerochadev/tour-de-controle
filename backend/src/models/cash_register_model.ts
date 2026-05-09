import pool from "../config/db";

export interface CashRegister {
  id_cash_register: number;
  date_opened: Date;
  date_closed?: Date;
  has_gap: boolean;
  physical_amount: number;
  theoretical_amount: number;
  status: "OPEN" | "CLOSED";
  opened_by: number;
  closed_by?: number;
}

export interface CashRegisterClose {
  funds: {
    id_payment_type: number;
    physical_amount: number;
  }[];
}

/**
 * Finds a cash register by its ID.
 * @param id - The cash register ID
 * @returns The cash register, or null if not found
 */
export const findById = async (id: number): Promise<CashRegister | null> => {
  const result = await pool.query(
    "SELECT * FROM cash_registers WHERE id_cash_register = $1",
    [id],
  );
  return result.rows[0] || null;
};

/**
 * Opens a new cash register with zero initial amounts.
 * @param opened_by - The user ID who opens the register
 * @returns The newly created cash register
 */
export const create = async (
  opened_by: number,
  physical_amount = 0,
): Promise<CashRegister> => {
  const result = await pool.query(
    `INSERT INTO cash_registers
     (date_opened, physical_amount, theoretical_amount, status, opened_by)
     VALUES ($1, $2, $3, $4, $5)
     RETURNING *`,
    [new Date(), physical_amount, physical_amount, "OPEN", opened_by],
  );

  return result.rows[0];
};

/**
 * Closes a cash register by computing theoretical vs physical amounts and detecting gaps.
 * @param id - The cash register ID to close
 * @param obj - Object containing physical fund amounts per payment type
 * @param closedBy - The user ID who closes the register
 * @returns The closed cash register and whether a gap was detected
 */
export const close = async (
  id: number,
  obj: CashRegisterClose,
  closedBy: number,
): Promise<{ cashRegister: CashRegister; hasGap: boolean }> => {
  const transactions = await pool.query(
    "SELECT * FROM transactions WHERE id_cash_register = $1",
    [id],
  );

  const theoreticalAmount = transactions.rows.reduce((acc, cur) => {
    return acc + Number(cur.amount);
  }, 0);

  const physicalAmount = obj.funds.reduce((acc, cur) => {
    return acc + cur.physical_amount;
  }, 0);

  const hasGap = theoreticalAmount !== physicalAmount;

  const result = await pool.query(
    `UPDATE cash_registers SET
      date_closed = $1,
      has_gap = $2,
      physical_amount = $3,
      theoretical_amount = $4,
      status = $5,
      closed_by = $6
     WHERE id_cash_register = $7
     RETURNING *`,
    [
      new Date(),
      hasGap,
      physicalAmount,
      theoreticalAmount,
      "CLOSED",
      closedBy,
      id,
    ],
  );

  return { cashRegister: result.rows[0], hasGap };
};

/**
 * Retrieves all currently open cash registers.
 * @returns Array of open cash registers
 */
export const current = async (): Promise<CashRegister[]> => {
  const result = await pool.query(
    "SELECT * FROM cash_registers WHERE status = $1",
    ["OPEN"],
  );
  return result.rows;
};
