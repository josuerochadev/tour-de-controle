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

	if (loading) {
		return (
			<div className="flex items-center justify-center py-20">
				<p className="font-mono text-ink-4 text-sm tracking-wider uppercase">Chargement...</p>
			</div>
		);
	}

	if (error) {
		return <div className="p-6 text-signal font-medium">{error}</div>;
	}

	const totals = totalsByType;
	const avgTransaction = transactions.length > 0
		? (theoreticalTotal / transactions.length).toFixed(2)
		: "0.00";

	const openDuration = currentRegister ? "en cours" : "";

	return (
		<div className="grid grid-cols-1 lg:grid-cols-[1.4fr_1fr] gap-6 max-w-[1400px] mx-auto">
			{/* Left column */}
			<div>
				<div className="font-mono text-[11px] tracking-[2px] uppercase text-ink-4">
					// Service &middot; {new Date(selectedDate).toLocaleDateString("fr-FR", { weekday: "long", day: "numeric", month: "long" })}
				</div>
				<h1 className="mt-2 font-display text-[32px] md:text-[44px] lg:text-[56px] font-semibold leading-none tracking-tight uppercase">
					La vigie
				</h1>
				<p className="mt-4 text-ink-2 text-base max-w-[560px] leading-relaxed">
					{currentRegister ? (
						<>Le service est ouvert {openDuration}. Vous avez encaisse <b className="font-display text-signal">{theoreticalTotal.toFixed(2)}&nbsp;&euro;</b> sur <b className="font-display">{transactions.length}</b> transactions.</>
					) : (
						<>La caisse est fermee. Aucun service en cours.</>
					)}
				</p>

				{/* Big number tower */}
				<div className="mt-9 p-8 bg-ink text-paper rounded-3xl relative overflow-hidden">
					<div className="flex justify-between items-start mb-4">
						<div>
							<div className="font-mono text-[11px] tracking-[2px] uppercase text-ink-4">// Encaisse &middot; service en cours</div>
							<div className="mt-3">
								<span className="font-display text-[48px] md:text-[68px] lg:text-[88px] font-semibold leading-none tracking-tight tabular-nums">
									{Math.floor(theoreticalTotal)}
									<span className="text-ink-3">,{(theoreticalTotal % 1).toFixed(2).slice(2)}</span>
								</span>
								<span className="font-display text-4xl font-medium text-signal ml-1">&euro;</span>
							</div>
						</div>
						<div className="text-right">
							<div className="font-mono text-[11px] tracking-[2px] uppercase text-ink-4">Transactions</div>
							<div className="font-display text-[22px] font-medium mt-1.5 tabular-nums">{transactions.length}</div>
							<div className="font-display text-[11px] text-beacon mt-1.5 tracking-wide tabular-nums">
								{avgTransaction}&nbsp;&euro; panier moyen
							</div>
						</div>
					</div>

					{/* Progress bar */}
					<div className="mt-6 pt-6 border-t border-ink-2">
						<div className="h-1 bg-ink-2 rounded-full overflow-hidden">
							<div
								className="h-full bg-signal rounded-full transition-all duration-500"
								style={{ width: `${Math.min((theoreticalTotal / 1800) * 100, 100)}%` }}
							/>
						</div>
						<div className="flex justify-between mt-2 font-mono text-[10px] text-ink-4 tracking-wide">
							<span>0 &euro;</span>
							<span>Objectif 1 800 &euro;</span>
						</div>
					</div>
				</div>

				{/* Payment split */}
				<div className="mt-6 p-7 bg-paper-soft border border-sand rounded-3xl">
					<div className="flex justify-between items-baseline mb-6">
						<h2 className="font-display text-2xl font-semibold tracking-tight uppercase m-0">Repartition</h2>
						<span className="font-mono text-[11px] tracking-[2px] uppercase text-ink-4">par moyen de paiement</span>
					</div>
					{Object.keys(totals).length === 0 ? (
						<p className="text-ink-4">Aucune donnee</p>
					) : (
						Object.entries(totals).map(([typeId, amount]) => {
							const percentage = theoreticalTotal > 0 ? (amount / theoreticalTotal) * 100 : 0;
							return (
								<div key={typeId} className="py-3.5 border-t border-sand">
									<div className="flex justify-between items-baseline gap-4">
										<span className="text-base text-ink">{getPaymentTypeName(Number(typeId))}</span>
										<span className="font-display text-[22px] font-medium whitespace-nowrap tabular-nums">
											{amount.toFixed(2)} <span className="text-ink-4 text-sm">&euro;</span>
										</span>
									</div>
									<div className="mt-2 h-1 bg-sand rounded-full overflow-hidden">
										<div
											className="h-full bg-ink rounded-full transition-all duration-500"
											style={{ width: `${percentage}%` }}
										/>
									</div>
									<div className="mt-1.5 font-mono text-[11px] text-ink-4 tabular-nums">{percentage.toFixed(0)}% du total</div>
								</div>
							);
						})
					)}
				</div>
			</div>

			{/* Right column */}
			<div className="flex flex-col gap-6">
				{/* Date filter */}
				<Filters onDateChange={handleDateChange} />

				{/* Status pulse */}
				<div className="p-7 bg-paper-soft border border-sand rounded-3xl">
					<div className="flex justify-between items-center">
						<span className="font-mono text-[11px] tracking-[2px] uppercase text-ink-4">Pouls du service</span>
						<span className="inline-flex items-center gap-1.5 font-mono text-[11px] tracking-wider uppercase text-ok">
							<span className="w-2 h-2 rounded-full bg-ok animate-tdc-pulse" />
							{currentRegister ? "en direct" : "hors service"}
						</span>
					</div>
					<div className="mt-6 grid grid-cols-3 gap-4">
						<div className="text-center">
							<div className="font-mono text-[11px] tracking-wider uppercase text-ink-4">Statut</div>
							<div className={`mt-2 font-display text-lg font-semibold uppercase ${currentRegister ? "text-ok" : "text-ink-4"}`}>
								{currentRegister ? "Ouverte" : "Fermee"}
							</div>
						</div>
						<div className="text-center">
							<div className="font-mono text-[11px] tracking-wider uppercase text-ink-4">Transactions</div>
							<div className="mt-2 font-display text-lg font-semibold tabular-nums">{transactions.length}</div>
						</div>
						<div className="text-center">
							<div className="font-mono text-[11px] tracking-wider uppercase text-ink-4">Panier moy.</div>
							<div className="mt-2 font-display text-lg font-semibold tabular-nums">{avgTransaction}&nbsp;&euro;</div>
						</div>
					</div>
				</div>

				{/* Alert card */}
				{currentRegister && transactions.length > 0 && (
					<div className="p-7 bg-ink text-paper rounded-3xl">
						<div className="font-mono text-[11px] tracking-[2px] uppercase text-ink-4">// Alerte du phare</div>
						<div className="mt-4 font-display text-lg font-medium leading-snug uppercase tracking-tight">
							<span className="font-display tabular-nums">{transactions.length}</span> transactions enregistrees.{" "}
							<span className="text-beacon">{Object.keys(totals).length} moyens</span> de paiement utilises.
						</div>
					</div>
				)}

				{/* Recent transactions */}
				<div className="p-7 bg-paper-soft border border-sand rounded-3xl">
					<div className="font-mono text-[11px] tracking-[2px] uppercase text-ink-4 mb-4">Dernieres transactions</div>
					{transactions.length === 0 ? (
						<p className="text-ink-4 text-sm">Aucune transaction</p>
					) : (
						transactions.slice(0, DASHBOARD_RECENT_LIMIT).map((transaction) => (
							<div key={transaction.id_transaction} className="flex justify-between items-center py-3 border-t border-sand">
								<div className="flex items-center gap-3.5">
									<span className="font-mono text-xs text-ink-4 tabular-nums">
										{new Date(transaction.created_at).toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" })}
									</span>
									<span className="text-sm text-ink-2">{getPaymentTypeName(transaction.id_payment_type)}</span>
								</div>
								<span className="font-display text-base font-medium tabular-nums">{transaction.amount.toFixed(2)}&nbsp;&euro;</span>
							</div>
						))
					)}
				</div>
			</div>
		</div>
	);
};

export default React.memo(Dashboard);
