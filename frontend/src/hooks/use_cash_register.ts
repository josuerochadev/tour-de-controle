import { useState, useEffect, useMemo, useCallback } from "react";
import CashRegisterService, {
	type CashRegister,
	type Transaction,
	type Funds,
} from "../services/cash_register_service";
import { PAYMENT_TYPE_FALLBACK, PAYMENT_TYPES } from "../constants";

/**
 * Hook that manages cash register state, transactions, and payment types.
 * @returns Current register, transactions, totals, and mutation methods.
 */
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
			for (const paymentType of types) {
				map[paymentType.id_payment_type] = paymentType.payment_type_name;
			}
			setPaymentTypes(map);
		} catch {
			// Fallback si l'endpoint n'existe pas encore
			setPaymentTypes(PAYMENT_TYPE_FALLBACK);
		}
	};

	const fetchCurrentRegister = async () => {
		try {
			const result = await CashRegisterService.getCurrentRegister();
			// L'API retourne un tableau de caisses ouvertes
			const register = Array.isArray(result) ? result[0] || null : result;
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

			const result = await CashRegisterService.getTransactions(query);
			// L'API retourne { data, total, page, limit } ou un tableau directement
			const raw = Array.isArray(result) ? result : result.data;
			// PostgreSQL DECIMAL retourne des strings, on les convertit en numbers
			const list = raw.map((transaction: Transaction) => ({
				...transaction,
				amount: Number(transaction.amount),
				tip: transaction.tip ? Number(transaction.tip) : 0,
			}));
			setTransactions(list);
			return list;
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
					id_payment_type: PAYMENT_TYPES.CASH,
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

	const totalsByType = useMemo(() => {
		return transactions.reduce(
			(acc, transaction) => {
				const type = transaction.id_payment_type;
				acc[type] = (acc[type] || 0) + transaction.amount;
				return acc;
			},
			{} as Record<number, number>,
		);
	}, [transactions]);

	const theoreticalTotal = useMemo(() => {
		return transactions.reduce((sum, transaction) => sum + transaction.amount, 0);
	}, [transactions]);

	const getPaymentTypeName = useCallback((typeId: number) => {
		return paymentTypes[typeId] || `Type ${typeId}`;
	}, [paymentTypes]);

	return {
		currentRegister,
		transactions,
		paymentTypes,
		loading,
		error,
		getPaymentTypeName,
		totalsByType,
		theoreticalTotal,
		openRegister,
		closeRegister,
		refreshTransactions: fetchTransactions,
		refreshRegister: fetchCurrentRegister,
	};
};
