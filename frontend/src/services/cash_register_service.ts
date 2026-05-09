// frontend/src/services/cash_register_service.ts

import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

/** Matches backend CashRegister — dates are ISO strings over JSON */
export interface CashRegister {
	id_cash_register: number;
	date_opened: string;
	date_closed?: string;
	has_gap: boolean;
	physical_amount: number;
	theoretical_amount: number;
	status: "OPEN" | "CLOSED";
	opened_by: number;
	closed_by?: number;
}

/** Matches backend Transaction — tip defaults to 0, amounts may arrive as strings from PostgreSQL DECIMAL */
export interface Transaction {
	id_transaction: number;
	amount: number;
	tip: number;
	created_at: string;
	id_payment_type: number;
	id_cash_register: number;
	created_by: number;
}

export interface Funds {
	id_payment_type: number;
	physical_amount: number;
}

/** Handles cash register and transaction API calls. */
class CashRegisterService {

	/**
	 * Fetches all currently open cash registers.
	 * @returns An array of open cash registers.
	 */
	async getCurrentRegister() {
		const response = await axios.get<CashRegister[]>(
			`${BASE_URL}/cash-registers/current`,
			{ withCredentials: true },
		);
		return response.data;
	}

	/**
	 * Opens a new cash register with an initial amount.
	 * @param physical_amount - The starting physical cash amount.
	 * @returns The newly created cash register.
	 */
	async openRegister(physical_amount: number) {
		const response = await axios.post<CashRegister>(
			`${BASE_URL}/cash-registers`,
			{ physical_amount },
			{ withCredentials: true },
		);
		return response.data;
	}

	/**
	 * Closes a cash register with the counted funds.
	 * @param id - The cash register ID.
	 * @param funds - Physical amounts per payment type.
	 * @returns The closed cash register.
	 */
	async closeRegister(id: number, funds: Funds[]) {
		const response = await axios.put<CashRegister>(
			`${BASE_URL}/cash-registers/${id}/close`,
			{ funds },
			{ withCredentials: true },
		);
		return response.data;
	}

	/**
	 * Fetches transactions with optional filters.
	 * @param query - Optional filter criteria (date range, payment type, amount, user).
	 * @returns The matching transactions.
	 */
	async getTransactions(query?: {
		date_from?: string;
		date_to?: string;
		payment_type?: number;
		amount_min?: number;
		amount_max?: number;
		user_id?: number;
	}) {
		const response = await axios.get(
			`${BASE_URL}/transactions`,
			{ withCredentials: true, params: query },
		);
		return response.data;
	}

	/** Fetches all available payment types. */
	async getPaymentTypes() {
		const response = await axios.get(
			`${BASE_URL}/payment-types`,
			{ withCredentials: true },
		);
		return response.data;
	}

	/**
	 * Creates a new transaction.
	 * @param transaction - The transaction data.
	 * @returns The created transaction.
	 */
	async createTransaction(transaction: Partial<Transaction>) {
		const response = await axios.post<Transaction>(
			`${BASE_URL}/transactions`,
			transaction,
			{ withCredentials: true },
		);
		return response.data;
	}

	/**
	 * Partially updates an existing transaction.
	 * @param id - The transaction ID.
	 * @param transaction - Fields to update.
	 * @returns The updated transaction.
	 */
	async updateTransaction(id: number, transaction: Partial<Transaction>) {
		const response = await axios.patch<Transaction>(
			`${BASE_URL}/transactions/${id}`,
			transaction,
			{ withCredentials: true },
		);
		return response.data;
	}

	/**
	 * Deletes a transaction by ID.
	 * @param id - The transaction ID to delete.
	 */
	async deleteTransaction(id: number) {
		await axios.delete(`${BASE_URL}/transactions/${id}`, {
			withCredentials: true,
		});
	}
}

export default new CashRegisterService();
