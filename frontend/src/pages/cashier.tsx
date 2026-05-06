import React, { useState, useMemo } from "react";
import { useCashRegister } from "../hooks/use_cash_register";
import Filters from "../components/filters";
import { formatTodayDate } from "../constants";

const CashierPage = () => {
	const {
		currentRegister,
		transactions,
		loading,
		error,
		totalsByType,
		theoreticalTotal,
		getPaymentTypeName,
		openRegister,
		closeRegister,
		refreshTransactions,
	} = useCashRegister();

	const [selectedDate, setSelectedDate] = useState<string>(formatTodayDate());
	const [openingAmount, setOpeningAmount] = useState<number>(0);

	const handleDateChange = async (date: string) => {
		setSelectedDate(date);
		await refreshTransactions(date);
	};

	const totalTransactions = useMemo(
		() => transactions.reduce((sum, transaction) => sum + transaction.amount, 0),
		[transactions],
	);

	const handleOpenRegister = async (amount: number) => {
		await openRegister(amount);
	};

	const handleCloseRegister = async () => {
		if (currentRegister) {
			await closeRegister(
				currentRegister.id_cash_register,
				currentRegister.physical_amount,
			);
		}
	};

	if (loading) return <div className="p-6">Chargement...</div>;
	if (error) return <div className="p-6 text-red-500">{error}</div>;

	const totals = totalsByType;

	return (
		<div className="min-h-screen bg-gray-50 p-4">
			<div className="mb-4">
				<Filters onDateChange={handleDateChange} />
			</div>

			<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
				<div className="bg-white rounded-lg shadow p-4">
					<h2 className="text-xl font-bold mb-4">Fond de caisse</h2>
					<div className="space-y-4">
						{!currentRegister ? (
							<>
								<div>
									<label htmlFor="opening-amount" className="block text-sm font-medium text-gray-700">
										Fond de caisse ouverture
									</label>
									<input
										id="opening-amount"
										type="number"
										className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
										value={openingAmount}
										onChange={(e) => setOpeningAmount(Number(e.target.value))}
									/>
								</div>
								<button
									type="button"
									aria-label="Ouvrir la caisse"
									className="w-full bg-cyan-500 text-white p-2 rounded hover:bg-cyan-600"
									onClick={() => handleOpenRegister(openingAmount)}
								>
									Ouvrir la caisse
								</button>
							</>
						) : (
							<>
								<div className="flex justify-between">
									<span>Fond de caisse:</span>
									<span>{currentRegister.physical_amount} EUR</span>
								</div>
								<div className="flex justify-between">
									<span>Montant théorique:</span>
									<span>{theoreticalTotal} EUR</span>
								</div>
								<button
									type="button"
									aria-label="Clôturer la caisse"
									className="w-full bg-cyan-500 text-white p-2 rounded hover:bg-cyan-600"
									onClick={handleCloseRegister}
								>
									Clôturer la caisse
								</button>
							</>
						)}
					</div>
				</div>

				<div className="bg-white rounded-lg shadow p-4">
					<h2 className="text-xl font-bold mb-4">Récapitulatif par moyen de paiement</h2>
					<div className="space-y-2">
						{Object.entries(totals).map(([typeId, amount]) => (
							<div key={typeId} className="flex justify-between">
								<span>{getPaymentTypeName(Number(typeId))}:</span>
								<span>{amount} EUR</span>
							</div>
						))}
						<div className="border-t pt-2 mt-4">
							<div className="flex justify-between font-bold">
								<span>Total:</span>
								<span>{theoreticalTotal} EUR</span>
							</div>
						</div>
					</div>
				</div>
			</div>

			<div className="md:col-span-2 bg-white rounded-lg shadow p-4 mt-4">
				<h2 className="text-xl font-bold mb-4">Transactions du {selectedDate}</h2>
				{transactions.length === 0 ? (
					<p className="text-gray-500">Aucune transaction pour cette date</p>
				) : (
					<div className="space-y-2">
						{transactions.map((transaction) => (
							<div key={transaction.id_transaction} className="flex justify-between items-center p-2 bg-gray-50 rounded">
								<div>
									<span className="font-medium">{new Date(transaction.created_at).toLocaleTimeString()}</span>
									<span className="ml-4">{getPaymentTypeName(transaction.id_payment_type)}</span>
								</div>
								<span className="font-bold">{transaction.amount} EUR</span>
							</div>
						))}
						<div className="border-t pt-4 mt-4">
							<div className="flex justify-between font-bold">
								<span>Total des transactions:</span>
								<span>{totalTransactions} EUR</span>
							</div>
						</div>
					</div>
				)}
			</div>
		</div>
	);
};

export default CashierPage;
