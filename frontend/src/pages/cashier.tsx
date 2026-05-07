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

	if (loading) {
		return (
			<div className="flex items-center justify-center py-20">
				<p className="font-mono text-ink-4 text-sm tracking-wider uppercase">Chargement...</p>
			</div>
		);
	}

	if (error) return <div className="p-6 text-signal font-medium">{error}</div>;

	const totals = totalsByType;
	const isOpen = !!currentRegister;
	const fond = Number(currentRegister?.physical_amount ?? 0);

	return (
		<div className="max-w-[1200px] mx-auto">
			{/* Page header */}
			<div className="flex justify-between items-end mb-8 flex-wrap gap-4">
				<div>
					<div className="font-mono text-[11px] tracking-[2px] uppercase text-ink-4">// Tableau de bord &middot; caisse principale</div>
					<h1 className="mt-2 font-display text-[56px] font-semibold leading-none tracking-tight uppercase">La caisse</h1>
				</div>
				<div className={`flex items-center gap-3 px-5 py-3 rounded-full ${isOpen ? "bg-ok-soft" : "bg-paper-2"}`}>
					<span className={`w-2 h-2 rounded-full ${isOpen ? "bg-ok animate-tdc-pulse" : "bg-ink-4"}`} />
					<span className={`font-display text-xs font-semibold tracking-wider uppercase ${isOpen ? "text-ok-deep" : "text-ink-2"}`}>
						{isOpen ? "Caisse ouverte" : "Caisse fermee"}
					</span>
				</div>
			</div>

			{/* Filters */}
			<div className="mb-6">
				<Filters onDateChange={handleDateChange} />
			</div>

			{/* Main grid */}
			<div className="grid grid-cols-1 lg:grid-cols-[1.2fr_1fr] gap-6">
				{/* Tower card */}
				<div className="p-9 bg-ink text-paper rounded-3xl">
					<div className="font-mono text-[11px] tracking-[2px] uppercase text-ink-4">// Theorique en caisse</div>
					<div className="mt-4">
						<span className="font-display text-[104px] font-semibold leading-none tracking-tight tabular-nums">
							{Math.floor(theoreticalTotal)}
							<span className="text-ink-3">,{(theoreticalTotal % 1).toFixed(2).slice(2)}</span>
						</span>
						<span className="font-display text-[44px] font-medium text-signal ml-1">&euro;</span>
					</div>

					<div className="flex gap-6 mt-8 pt-6 border-t border-ink-2">
						<div>
							<div className="font-mono text-[11px] tracking-[2px] uppercase text-ink-4">Fond ouverture</div>
							<div className="font-display text-[22px] mt-1.5 tabular-nums">{fond.toFixed(2)}&nbsp;&euro;</div>
						</div>
						<div className="w-px bg-ink-2" />
						<div>
							<div className="font-mono text-[11px] tracking-[2px] uppercase text-ink-4">Encaisse</div>
							<div className="font-display text-[22px] mt-1.5 text-beacon tabular-nums">+&nbsp;{totalTransactions.toFixed(2)}&nbsp;&euro;</div>
						</div>
						<div className="w-px bg-ink-2" />
						<div>
							<div className="font-mono text-[11px] tracking-[2px] uppercase text-ink-4">Transactions</div>
							<div className="font-display text-[22px] mt-1.5 tabular-nums">{transactions.length}</div>
						</div>
					</div>

					<div className="mt-8 flex gap-3">
						{!isOpen ? (
							<>
								<div className="flex-1">
									<label className="font-mono text-[11px] tracking-[1.5px] uppercase text-ink-4 block mb-2">Fond de caisse</label>
									<input
										type="number"
										className="w-full py-3.5 px-4 border border-ink-2 rounded-[14px] bg-ink text-paper font-display text-lg outline-none focus:ring-2 focus:ring-signal tabular-nums"
										value={openingAmount}
										onChange={(e) => setOpeningAmount(Number(e.target.value))}
									/>
								</div>
								<button
									type="button"
									aria-label="Ouvrir la caisse"
									className="self-end py-4 px-6 rounded-2xl bg-paper text-ink border-none font-display text-[13px] font-semibold tracking-wider uppercase cursor-pointer hover:bg-paper-2 transition-colors duration-200"
									onClick={() => handleOpenRegister(openingAmount)}
								>
									Ouvrir la caisse &rarr;
								</button>
							</>
						) : (
							<>
								<button
									type="button"
									aria-label="Cloturer la caisse"
									className="flex-1 py-4 px-5 rounded-2xl bg-signal text-paper border-none font-display text-[13px] font-semibold tracking-wider uppercase cursor-pointer hover:bg-signal-deep transition-colors duration-200"
									onClick={handleCloseRegister}
								>
									Cloturer la caisse
								</button>
							</>
						)}
					</div>
				</div>

				{/* Recap card */}
				<div className="p-8 bg-paper-soft border border-sand rounded-3xl">
					<div className="flex justify-between items-baseline mb-5">
						<h2 className="font-display text-[22px] font-semibold tracking-tight uppercase m-0">Recapitulatif</h2>
						<span className="font-mono text-[11px] tracking-[2px] uppercase text-ink-4">par moyen</span>
					</div>
					{Object.entries(totals).map(([typeId, amount]) => (
						<div key={typeId} className="flex justify-between items-center gap-4 py-4 border-t border-sand">
							<div>
								<div className="text-[15px] text-ink-2">{getPaymentTypeName(Number(typeId))}</div>
								<div className="font-mono text-[11px] text-ink-4 mt-1 tabular-nums">
									{theoreticalTotal > 0 ? ((amount / theoreticalTotal) * 100).toFixed(0) : 0}% DU TOTAL
								</div>
							</div>
							<div className="font-display text-[22px] font-medium whitespace-nowrap tabular-nums">
								{amount.toFixed(2)} <span className="text-ink-4 text-sm">&euro;</span>
							</div>
						</div>
					))}
					<div className="flex justify-between items-baseline pt-5 border-t-2 border-ink mt-2">
						<span className="font-display text-[13px] tracking-wider uppercase text-ink font-semibold">Total</span>
						<div className="font-display text-[32px] font-semibold tracking-tight text-signal tabular-nums">
							{theoreticalTotal.toFixed(2)}&nbsp;&euro;
						</div>
					</div>
				</div>
			</div>

			{/* Transactions list */}
			<div className="mt-6 bg-paper-soft border border-sand rounded-3xl overflow-hidden">
				<div className="px-7 py-4 border-b border-sand">
					<span className="font-mono text-[11px] tracking-[2px] uppercase text-ink-4">Transactions du {selectedDate}</span>
				</div>
				{transactions.length === 0 ? (
					<p className="p-7 text-ink-4">Aucune transaction pour cette date</p>
				) : (
					<>
						<div className="flex px-7 py-3 border-b border-sand font-mono text-[11px] tracking-[2px] uppercase text-ink-4">
							<div className="w-20">Heure</div>
							<div className="flex-1">Moyen</div>
							<div className="w-36 text-right">Montant</div>
						</div>
						{transactions.map((transaction) => (
							<div
								key={transaction.id_transaction}
								className="flex items-center px-7 py-4 border-t border-sand hover:bg-paper-2 transition-colors duration-150"
							>
								<div className="w-20 font-mono text-[13px] text-ink-3 tabular-nums">
									{new Date(transaction.created_at).toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" })}
								</div>
								<div className="flex-1 text-[15px]">{getPaymentTypeName(transaction.id_payment_type)}</div>
								<div className="w-36 text-right font-display text-lg font-medium tabular-nums">{transaction.amount.toFixed(2)}&nbsp;&euro;</div>
							</div>
						))}
						<div className="flex justify-between items-baseline px-7 py-5 border-t-2 border-ink">
							<span className="font-display text-[13px] tracking-wider uppercase font-semibold">Total</span>
							<span className="font-display text-2xl font-semibold text-signal tabular-nums">{totalTransactions.toFixed(2)}&nbsp;&euro;</span>
						</div>
					</>
				)}
			</div>
		</div>
	);
};

export default CashierPage;
