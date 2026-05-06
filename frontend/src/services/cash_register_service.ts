// frontend/src/services/cash_register_service.ts

import axios from "axios";

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

export interface Transaction {
	id_transaction: number;
	amount: number;
	tip?: number;
	created_at: string;
	id_payment_type: number;
	id_cash_register: number;
	id_user: number;
}

export interface Funds {
	id_payment_type: number;
	physical_amount: number;
}

class CashRegisterService {
	private static BASE_URL = `${import.meta.env.VITE_API_BASE_URL}`;

	async getCurrentRegister() {
		const response = await axios.get<CashRegister[]>(
			`${CashRegisterService.BASE_URL}/cash-registers/current`,
			{ withCredentials: true },
		);
		return response.data;
	}

	async openRegister(physical_amount: number) {
		const response = await axios.post<CashRegister>(
			`${CashRegisterService.BASE_URL}/cash-registers`,
			{ physical_amount },
			{ withCredentials: true },
		);
		return response.data;
	}

	async closeRegister(id: number, funds: Funds[]) {
		const response = await axios.put<CashRegister>(
			`${CashRegisterService.BASE_URL}/cash-registers/${id}/close`,
			{ funds },
			{ withCredentials: true },
		);
		return response.data;
	}

	async getTransactions(query?: {
		date_from?: string;
		date_to?: string;
		payment_type?: number;
		amount_min?: number;
		amount_max?: number;
		user_id?: number;
	}) {
		const response = await axios.get(
			`${CashRegisterService.BASE_URL}/transactions`,
			{ withCredentials: true, params: query },
		);
		return response.data;
	}

	async getPaymentTypes() {
		const response = await axios.get(
			`${CashRegisterService.BASE_URL}/payment-types`,
			{ withCredentials: true },
		);
		return response.data;
	}

	async createTransaction(transaction: Partial<Transaction>) {
		const response = await axios.post<Transaction>(
			`${CashRegisterService.BASE_URL}/transactions`,
			transaction,
			{ withCredentials: true },
		);
		return response.data;
	}

	async updateTransaction(id: number, transaction: Partial<Transaction>) {
		const response = await axios.patch<Transaction>(
			`${CashRegisterService.BASE_URL}/transactions/${id}`,
			transaction,
			{ withCredentials: true },
		);
		return response.data;
	}

	async deleteTransaction(id: number) {
		await axios.delete(`${CashRegisterService.BASE_URL}/transactions/${id}`, {
			withCredentials: true,
		});
	}
}

export default new CashRegisterService();
