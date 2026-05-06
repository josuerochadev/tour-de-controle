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
		try {
			const response = await axios.get<CashRegister[]>(
				`${CashRegisterService.BASE_URL}/cash-registers/current`,
				{
					withCredentials: true,
				},
			);
			return response.data;
		} catch (error) {
			console.error("Erreur lors de la récupération de la caisse:", error);
			throw error;
		}
	}

	async openRegister(physical_amount: number) {
		try {
			const response = await axios.post<CashRegister>(
				`${CashRegisterService.BASE_URL}/cash-registers`,
				{ physical_amount },
				{
					withCredentials: true,
				},
			);
			return response.data;
		} catch (error) {
			console.error("Erreur lors de l'ouverture de la caisse:", error);
			throw error;
		}
	}

	async closeRegister(id: number, funds: Funds[]) {
		try {
			const response = await axios.put<CashRegister>(
				`${CashRegisterService.BASE_URL}/cash-registers/${id}/close`,
				{ funds },
				{
					withCredentials: true,
				},
			);
			return response.data;
		} catch (error) {
			console.error("Erreur lors de la fermeture de la caisse:", error);
			throw error;
		}
	}

	async getTransactions(query?: {
		date_from?: string;
		date_to?: string;
		payment_type?: number;
		amount_min?: number;
		amount_max?: number;
		user_id?: number;
	}) {
		try {
			const response = await axios.get(
				`${CashRegisterService.BASE_URL}/transactions`,
				{
					withCredentials: true,
					params: query,
				},
			);
			return response.data;
		} catch (error) {
			console.error("Erreur lors de la récupération des transactions:", error);
			throw error;
		}
	}

	async getPaymentTypes() {
		try {
			const response = await axios.get(
				`${CashRegisterService.BASE_URL}/payment-types`,
				{
					withCredentials: true,
				},
			);
			return response.data;
		} catch (error) {
			console.error(
				"Erreur lors de la récupération des types de paiement:",
				error,
			);
			throw error;
		}
	}

	// Ajout de méthodes pour la gestion des transactions individuelles
	async createTransaction(transaction: Partial<Transaction>) {
		try {
			const response = await axios.post<Transaction>(
				`${CashRegisterService.BASE_URL}/transactions`,
				transaction,
				{
					withCredentials: true,
				},
			);
			return response.data;
		} catch (error) {
			console.error("Erreur lors de la création de la transaction:", error);
			throw error;
		}
	}

	async updateTransaction(id: number, transaction: Partial<Transaction>) {
		try {
			const response = await axios.patch<Transaction>(
				`${CashRegisterService.BASE_URL}/transactions/${id}`,
				transaction,
				{
					withCredentials: true,
				},
			);
			return response.data;
		} catch (error) {
			console.error("Erreur lors de la mise à jour de la transaction:", error);
			throw error;
		}
	}

	async deleteTransaction(id: number) {
		try {
			await axios.delete(`${CashRegisterService.BASE_URL}/transactions/${id}`, {
				withCredentials: true,
			});
		} catch (error) {
			console.error("Erreur lors de la suppression de la transaction:", error);
			throw error;
		}
	}
}

export default new CashRegisterService();
