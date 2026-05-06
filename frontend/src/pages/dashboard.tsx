import React, { useState } from "react";
import { useCashRegister } from "../hooks/use_cash_register";
import Filters from "../components/filters";
import { formatTodayDate, DASHBOARD_RECENT_LIMIT } from "../constants";

const Dashboard: React.FC = () => {
	const {
		currentRegister,
		transactions,
		loading,
		error,
		totalsByType,
		theoreticalTotal,
		getPaymentTypeName,
		refreshTransactions,
	} = useCashRegister();

	const [selectedDate, setSelectedDate] = useState<string>(formatTodayDate());

	const handleDateChange = async (date: string) => {
		setSelectedDate(date);
		await refreshTransactions(date);
	};

	if (loading) return <div className="p-6">Chargement...</div>;
	if (error) return <div className="p-6 text-red-500">{error}</div>;

	const totals = totalsByType;
	const avgTransaction = transactions.length > 0
		? (theoreticalTotal / transactions.length).toFixed(2)
		: "0.00";

	return (
		<div className="min-h-screen bg-gray-50 p-4">
			<div className="mb-6">
				<Filters onDateChange={handleDateChange} />
			</div>

			<h1 className="text-2xl font-bold mb-6">Tableau de bord — {selectedDate}</h1>

			{/* KPI Cards */}
			<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
				<div className="bg-white rounded-lg shadow p-4">
					<p className="text-sm text-gray-500">Statut caisse</p>
					<p className={`text-2xl font-bold ${currentRegister ? "text-green-600" : "text-gray-400"}`}>
						{currentRegister ? "Ouverte" : "Fermée"}
					</p>
				</div>
				<div className="bg-white rounded-lg shadow p-4">
					<p className="text-sm text-gray-500">Transactions du jour</p>
					<p className="text-2xl font-bold text-cyan-600">{transactions.length}</p>
				</div>
				<div className="bg-white rounded-lg shadow p-4">
					<p className="text-sm text-gray-500">Total encaissé</p>
					<p className="text-2xl font-bold text-cyan-600">{theoreticalTotal.toFixed(2)} EUR</p>
				</div>
				<div className="bg-white rounded-lg shadow p-4">
					<p className="text-sm text-gray-500">Panier moyen</p>
					<p className="text-2xl font-bold text-cyan-600">{avgTransaction} EUR</p>
				</div>
			</div>

			{/* Répartition par moyen de paiement */}
			<div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
				<div className="bg-white rounded-lg shadow p-4">
					<h2 className="text-lg font-bold mb-4">Répartition par moyen de paiement</h2>
					{Object.keys(totals).length === 0 ? (
						<p className="text-gray-500">Aucune donnée</p>
					) : (
						<div className="space-y-3">
							{Object.entries(totals).map(([typeId, amount]) => {
								const percentage = theoreticalTotal > 0 ? (amount / theoreticalTotal) * 100 : 0;
								return (
									<div key={typeId}>
										<div className="flex justify-between text-sm mb-1">
											<span>{getPaymentTypeName(Number(typeId))}</span>
											<span className="font-medium">{amount.toFixed(2)} EUR ({percentage.toFixed(0)}%)</span>
										</div>
										<div className="w-full bg-gray-200 rounded-full h-2">
											<div
												className="bg-cyan-500 h-2 rounded-full"
												style={{ width: `${percentage}%` }}
											/>
										</div>
									</div>
								);
							})}
						</div>
					)}
				</div>

				{/* Dernières transactions */}
				<div className="bg-white rounded-lg shadow p-4">
					<h2 className="text-lg font-bold mb-4">Dernières transactions</h2>
					{transactions.length === 0 ? (
						<p className="text-gray-500">Aucune transaction</p>
					) : (
						<div className="space-y-2 max-h-64 overflow-y-auto">
							{transactions.slice(0, DASHBOARD_RECENT_LIMIT).map((transaction) => (
								<div key={transaction.id_transaction} className="flex justify-between items-center p-2 bg-gray-50 rounded">
									<div className="text-sm">
										<span className="font-medium">{new Date(transaction.created_at).toLocaleTimeString()}</span>
										<span className="ml-3 text-gray-600">{getPaymentTypeName(transaction.id_payment_type)}</span>
									</div>
									<span className="font-bold">{transaction.amount.toFixed(2)} EUR</span>
								</div>
							))}
						</div>
					)}
				</div>
			</div>
		</div>
	);
};

export default Dashboard;
