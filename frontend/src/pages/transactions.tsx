import React, { useState } from "react";
import { useCashRegister } from "../hooks/use_cash_register";
import Filters from "../components/filters";

const PAYMENT_TYPES: Record<number, string> = {
	1: "Espèces",
	2: "CB",
	3: "Ticket Restaurant",
};

const TransactionsPage = () => {
	const { transactions, loading, error, refreshTransactions } =
		useCashRegister();

	const [selectedDate, setSelectedDate] = useState<string>(
		new Date().toISOString().split("T")[0],
	);

	const handleDateChange = async (date: string) => {
		setSelectedDate(date);
		await refreshTransactions(date);
	};

	const getPaymentTypeName = (typeId: number) => {
		return PAYMENT_TYPES[typeId] || `Type ${typeId}`;
	};

	const getTotalTransactions = () => {
		return transactions.reduce((sum, t) => sum + t.amount, 0);
	};

	if (loading) return <div>Chargement...</div>;
	if (error) return <div className="text-red-500">{error}</div>;

	return (
		<div className="min-h-screen bg-gray-50 p-4">
			<div className="mb-4">
				<Filters onDateChange={handleDateChange} />
			</div>

			<div className="bg-white rounded-lg shadow p-4">
				<h2 className="text-xl font-bold mb-4">
					Transactions du {selectedDate}
				</h2>
				{transactions.length === 0 ? (
					<p className="text-gray-500">Aucune transaction pour cette date</p>
				) : (
					<div className="space-y-2">
						<div className="grid grid-cols-3 gap-4 font-semibold text-gray-600 p-2">
							<div>Heure</div>
							<div>Type</div>
							<div className="text-right">Montant</div>
						</div>
						{transactions.map((transaction) => (
							<div
								key={transaction.id_transaction}
								className="grid grid-cols-3 gap-4 p-2 bg-gray-50 rounded items-center"
							>
								<div className="font-medium">
									{new Date(transaction.created_at).toLocaleTimeString()}
								</div>
								<div>{getPaymentTypeName(transaction.id_payment_type)}</div>
								<div className="text-right font-bold">
									{transaction.amount}€
								</div>
							</div>
						))}
						<div className="border-t pt-4 mt-4">
							<div className="flex justify-between font-bold text-lg">
								<span>Total des transactions:</span>
								<span>{getTotalTransactions()}€</span>
							</div>
						</div>
					</div>
				)}
			</div>
		</div>
	);
};

export default TransactionsPage;
