import React, { useState } from "react";
import { useCashRegister } from "../hooks/use_cash_register";
import Filters from "../components/filters";

// Mapping des types de paiement
const PAYMENT_TYPES: Record<number, string> = {
	1: "Espèces",
	2: "CB",
	3: "Ticket Restaurant",
	// Ajoutez d'autres types selon vos besoins
};

const CashierPage = () => {
	const {
		currentRegister,
		transactions,
		loading,
		error,
		getTotalsByType,
		getTheoreticalTotal,
		openRegister,
		closeRegister,
		refreshTransactions,
	} = useCashRegister();

	const [selectedDate, setSelectedDate] = useState<string>(
		new Date().toISOString().split("T")[0],
	);

	const [openingAmount, setOpeningAmount] = useState<number>(0);
	const paymentTypes = PAYMENT_TYPES;

	const handleDateChange = async (date: string) => {
		setSelectedDate(date);
		await refreshTransactions(date);
	};

	const getTotalTransactions = () => {
		return transactions.reduce((sum, t) => sum + t.amount, 0);
	};

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

	const getPaymentTypeName = (typeId: number) => {
		return paymentTypes[typeId] || `Type ${typeId}`;
	};

	if (loading) return <div>Chargement...</div>;
	if (error) return <div className="text-red-500">{error}</div>;

	const totals = getTotalsByType();
	const theoreticalTotal = getTheoreticalTotal();

	return (
		<div className="min-h-screen bg-gray-50 p-4">
			<div className="mb-4">
				<Filters onDateChange={handleDateChange} />
			</div>

			<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
				{/* Fond de caisse */}
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
									<span>{currentRegister.physical_amount}€</span>
								</div>
								<div className="flex justify-between">
									<span>Montant théorique:</span>
									<span>{theoreticalTotal}€</span>
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

				{/* Récapitulatif */}
				<div className="bg-white rounded-lg shadow p-4">
					<h2 className="text-xl font-bold mb-4">
						Récapitulatif par moyen de paiement
					</h2>
					<div className="space-y-2">
						{Object.entries(totals).map(([typeId, amount]) => (
							<div key={typeId} className="flex justify-between">
								<span>{getPaymentTypeName(Number(typeId))}:</span>
								<span>{amount}€</span>
							</div>
						))}
						<div className="border-t pt-2 mt-4">
							<div className="flex justify-between font-bold">
								<span>Total:</span>
								<span>{theoreticalTotal}€</span>
							</div>
						</div>
					</div>
				</div>
			</div>

			{/* Liste des transactions */}
			<div className="md:col-span-2 bg-white rounded-lg shadow p-4 mt-4">
				<h2 className="text-xl font-bold mb-4">
					Transactions du {selectedDate}
				</h2>
				{transactions.length === 0 ? (
					<p className="text-gray-500">Aucune transaction pour cette date</p>
				) : (
					<div className="space-y-2">
						{transactions.map((transaction) => (
							<div
								key={transaction.id_transaction}
								className="flex justify-between items-center p-2 bg-gray-50 rounded"
							>
								<div>
									<span className="font-medium">
										{new Date(transaction.created_at).toLocaleTimeString()}
									</span>
									<span className="ml-4">
										{getPaymentTypeName(transaction.id_payment_type)}
									</span>
								</div>
								<span className="font-bold">{transaction.amount}€</span>
							</div>
						))}
						<div className="border-t pt-4 mt-4">
							<div className="flex justify-between font-bold">
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

export default CashierPage;
