import { useState, useEffect } from "react";
import CashRegisterService, {
	type CashRegister,
	type Transaction,
	type Funds,
} from "../services/cash_register_service";

export const useCashRegister = () => {
	const [currentRegister, setCurrentRegister] = useState<CashRegister | null>(
		null,
	);
	const [transactions, setTransactions] = useState<Transaction[]>([]);
	const [paymentTypes, setPaymentTypes] = useState<Record<number, string>>({});
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	const fetchPaymentTypes = async () => {
		try {
			const types = await CashRegisterService.getPaymentTypes();
			const map: Record<number, string> = {};
			for (const t of types) {
				map[t.id_payment_type] = t.payment_type_name;
			}
			setPaymentTypes(map);
		} catch {
			// Fallback si l'endpoint n'existe pas encore
			setPaymentTypes({ 1: "Espèces", 2: "CB", 3: "Ticket Restaurant", 4: "Chèque", 5: "Chèques Vacances", 6: "American Express" });
		}
	};

	const fetchCurrentRegister = async () => {
		try {
			const register = await CashRegisterService.getCurrentRegister();
			setCurrentRegister(register);
			return register;
		} catch {
			setError("Erreur lors de la récupération de la caisse");
			return null;
		}
	};

	const fetchTransactions = async (date?: string) => {
		try {
			// Format de la date pour l'API
			const query = date
				? {
						date_from: `${date}T00:00:00.000Z`,
						date_to: `${date}T23:59:59.999Z`,
					}
				: undefined;

			const transactions = await CashRegisterService.getTransactions(query);
			setTransactions(transactions);
			return transactions;
		} catch {
			setError("Erreur lors de la récupération des transactions");
			return [];
		}
	};

	const openRegister = async (amount: number) => {
		try {
			const register = await CashRegisterService.openRegister(amount);
			setCurrentRegister(register);
			return register;
		} catch {
			setError("Erreur lors de l'ouverture de la caisse");
			return null;
		}
	};

	const closeRegister = async (id: number, amount: number) => {
		try {
			// Création de la structure de fonds attendue par l'API
			const funds: Funds[] = [
				{
					id_payment_type: 1, // ID pour les espèces
					physical_amount: amount,
				},
			];

			const register = await CashRegisterService.closeRegister(id, funds);
			setCurrentRegister(register);
			return register;
		} catch {
			setError("Erreur lors de la fermeture de la caisse");
			return null;
		}
	};

	useEffect(() => {
		const init = async () => {
			setLoading(true);
			await fetchPaymentTypes();
			await fetchCurrentRegister();
			await fetchTransactions();
			setLoading(false);
		};
		init();
	}, []);

	// Calculer les totaux par type de paiement
	const getTotalsByType = () => {
		return transactions.reduce(
			(acc, transaction) => {
				const paymentType = transaction.id_payment_type;
				acc[paymentType] = (acc[paymentType] || 0) + transaction.amount;
				return acc;
			},
			{} as Record<number, number>,
		);
	};

	// Calculer le total théorique
	const getTheoreticalTotal = () => {
		return transactions.reduce((sum, t) => sum + t.amount, 0);
	};

	const getPaymentTypeName = (typeId: number) => {
		return paymentTypes[typeId] || `Type ${typeId}`;
	};

	return {
		currentRegister,
		transactions,
		paymentTypes,
		loading,
		error,
		getPaymentTypeName,
		getTotalsByType,
		getTheoreticalTotal,
		openRegister,
		closeRegister,
		refreshTransactions: fetchTransactions,
		refreshRegister: fetchCurrentRegister,
	};
};
