import React, { useState, useMemo } from "react";
import { useCashRegister } from "../hooks/use_cash_register";
import Filters from "../components/filters";
import { formatTodayDate } from "../constants";

const TransactionsPage = () => {
	const { transactions, loading, error, refreshTransactions, getPaymentTypeName } =
		useCashRegister();

	const [selectedDate, setSelectedDate] = useState<string>(formatTodayDate());

	const handleDateChange = async (date: string) => {
		setSelectedDate(date);
		await refreshTransactions(date);
	};

	const totalTransactions = useMemo(
		() => transactions.reduce((sum, transaction) => sum + transaction.amount, 0),
		[transactions],
	);

	if (loading) {
		return (
			<div className="flex items-center justify-center py-20">
				<p className="font-mono text-ink-4 text-sm tracking-wider uppercase">Chargement...</p>
			</div>
		);
	}

	if (error) return <div className="p-6 text-signal font-medium">{error}</div>;

	const avgTransaction = transactions.length > 0
		? (totalTransactions / transactions.length).toFixed(2)
		: "0.00";

	return (
		<div className="max-w-[1200px] mx-auto">
			{/* Page header */}
			<div className="flex justify-between items-end flex-wrap gap-6 mb-12">
				<div>
					<div className="font-mono text-[11px] tracking-[2px] uppercase text-ink-4">
						// Journal &middot; {new Date(selectedDate).toLocaleDateString("fr-FR")}
					</div>
					<h1 className="mt-2 font-display text-[56px] font-semibold leading-none tracking-tight uppercase whitespace-nowrap">
						Le flux
					</h1>
				</div>
				<Filters onDateChange={handleDateChange} />
			</div>

			{/* KPI cards */}
			<div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
				{[
					{ label: "Total encaisse", value: totalTransactions.toFixed(2), suffix: "\u20AC" },
					{ label: "Transactions", value: String(transactions.length), suffix: "" },
					{ label: "Panier moyen", value: avgTransaction, suffix: "\u20AC" },
				].map((kpi) => (
					<div key={kpi.label} className="p-6 bg-paper-soft border border-sand rounded-3xl">
						<div className="font-mono text-[11px] tracking-[2px] uppercase text-ink-4">{kpi.label}</div>
						<div className="mt-3">
							<span className="font-display text-[48px] font-semibold leading-none tracking-tight tabular-nums">{kpi.value}</span>
							{kpi.suffix && <span className="font-display text-2xl text-ink-4 ml-1">{kpi.suffix}</span>}
						</div>
					</div>
				))}
			</div>

			{/* Transaction list */}
			<div className="bg-paper-soft border border-sand rounded-3xl overflow-hidden">
				{transactions.length === 0 ? (
					<p className="p-7 text-ink-4">Aucune transaction pour cette date</p>
				) : (
					<table className="w-full">
						<thead>
							<tr className="border-b border-sand font-mono text-[11px] tracking-[2px] uppercase text-ink-4">
								<th scope="col" className="px-7 py-4 text-left font-mono font-normal">Heure</th>
								<th scope="col" className="px-2 py-4 text-left font-mono font-normal">Moyen</th>
								<th scope="col" className="px-2 py-4 text-right font-mono font-normal">Reference</th>
								<th scope="col" className="px-7 py-4 text-right font-mono font-normal">Montant</th>
							</tr>
						</thead>
						<tbody>
							{transactions.map((transaction) => (
								<tr
									key={transaction.id_transaction}
									className="border-t border-sand hover:bg-paper-2 transition-colors duration-150"
								>
									<td className="px-7 py-4 font-mono text-[13px] text-ink-3 tabular-nums whitespace-nowrap">
										{new Date(transaction.created_at).toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" })}
									</td>
									<td className="px-2 py-4 text-[15px]">{getPaymentTypeName(transaction.id_payment_type)}</td>
									<td className="px-2 py-4 text-right font-mono text-xs text-ink-4">
										#{String(1000 + transaction.id_transaction).padStart(5, "0")}
									</td>
									<td className="px-7 py-4 text-right font-display text-lg font-medium tabular-nums whitespace-nowrap">
										{transaction.amount.toFixed(2)}&nbsp;&euro;
									</td>
								</tr>
							))}
						</tbody>
						<tfoot>
							<tr className="border-t-2 border-ink">
								<td colSpan={3} className="px-7 py-5 font-display text-[13px] tracking-wider uppercase font-semibold">Total des transactions</td>
								<td className="px-7 py-5 text-right font-display text-2xl font-semibold text-signal tabular-nums whitespace-nowrap">{totalTransactions.toFixed(2)}&nbsp;&euro;</td>
							</tr>
						</tfoot>
					</table>
				)}
			</div>
		</div>
	);
};

export default React.memo(TransactionsPage);
