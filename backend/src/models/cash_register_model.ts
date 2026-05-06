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

export const create = async (opened_by: number): Promise<CashRegister> => {
	const initialAmount = 0;

	const result = await pool.query(
		`INSERT INTO cash_registers
     (date_opened, physical_amount, theoretical_amount, status, opened_by)
     VALUES ($1, $2, $3, $4, $5)
     RETURNING *`,
		[new Date(), initialAmount, initialAmount, "OPEN", opened_by],
	);

	return result.rows[0];
};

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
		[new Date(), hasGap, physicalAmount, theoreticalAmount, "CLOSED", closedBy, id],
	);

	return { cashRegister: result.rows[0], hasGap };
};

export const current = async (): Promise<CashRegister[]> => {
	const result = await pool.query(
		"SELECT * FROM cash_registers WHERE status = $1",
		["OPEN"],
	);
	return result.rows;
};
