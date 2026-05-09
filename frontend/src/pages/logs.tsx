import React, { useEffect, useState } from "react";
import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

interface ActionLog {
	id_log: number;
	action_type: string;
	action: string;
	details?: Record<string, unknown>;
	created_at: string;
	id_user?: number;
	first_name?: string;
	last_name?: string;
}

const TYPE_LABELS: Record<string, string> = {
	AUTH: "Auth",
	CASH: "Caisse",
	TRANSACTION: "Transaction",
	USER: "Utilisateur",
	SYSTEM: "Système",
};

const ACTION_TYPES = ["", "AUTH", "CASH", "TRANSACTION", "USER", "SYSTEM"];

const LogsPage = () => {
	const [logs, setLogs] = useState<ActionLog[]>([]);
	const [total, setTotal] = useState(0);
	const [loading, setLoading] = useState(true);
	const [type, setType] = useState("");
	const [page, setPage] = useState(1);
	const limit = 50;

	const fetchLogs = async (filterType: string, filterPage: number) => {
		setLoading(true);
		try {
			const params: Record<string, string | number> = { page: filterPage, limit };
			if (filterType) params.type = filterType;
			const res = await axios.get<{ data: ActionLog[]; total: number }>(
				`${BASE_URL}/action-logs`,
				{ withCredentials: true, params },
			);
			setLogs(res.data.data);
			setTotal(res.data.total);
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		fetchLogs(type, page);
	}, [type, page]);

	const totalPages = Math.ceil(total / limit);

	return (
		<div className="max-w-[1200px] mx-auto">
			<div className="flex justify-between items-end mb-8 flex-wrap gap-4">
				<div>
					<div className="font-mono text-[11px] tracking-[2px] uppercase text-ink-4">// Audit &middot; journal d'activité</div>
					<h1 className="mt-2 font-display text-[32px] md:text-[44px] lg:text-[56px] font-semibold leading-none tracking-tight uppercase">
						Journaux
					</h1>
				</div>
				<div className="flex items-center gap-3">
					<label htmlFor="log-type" className="font-mono text-[11px] tracking-[1.5px] uppercase text-ink-4">Type</label>
					<select
						id="log-type"
						value={type}
						onChange={(e) => { setType(e.target.value); setPage(1); }}
						className="py-2.5 px-4 border border-sand rounded-[14px] bg-paper font-sans text-sm outline-none focus:ring-2 focus:ring-signal"
					>
						{ACTION_TYPES.map((t) => (
							<option key={t} value={t}>{t ? TYPE_LABELS[t] : "Tous les types"}</option>
						))}
					</select>
				</div>
			</div>

			<div className="bg-paper-soft border border-sand rounded-3xl overflow-hidden">
				{loading ? (
					<p className="p-7 font-mono text-[11px] tracking-wider uppercase text-ink-4">Chargement...</p>
				) : logs.length === 0 ? (
					<p className="p-7 text-ink-4">Aucun journal trouvé</p>
				) : (
					<table className="w-full">
						<thead>
							<tr className="border-b border-sand font-mono text-[11px] tracking-[2px] uppercase text-ink-4">
								<th scope="col" className="px-7 py-4 text-left font-mono font-normal">Date</th>
								<th scope="col" className="px-2 py-4 text-left font-mono font-normal">Type</th>
								<th scope="col" className="px-2 py-4 text-left font-mono font-normal">Action</th>
								<th scope="col" className="px-2 py-4 text-left font-mono font-normal">Utilisateur</th>
								<th scope="col" className="px-7 py-4 text-left font-mono font-normal">Détails</th>
							</tr>
						</thead>
						<tbody>
							{logs.map((log) => (
								<tr key={log.id_log} className="border-t border-sand hover:bg-paper-2 transition-colors duration-150">
									<td className="px-7 py-4 font-mono text-[13px] text-ink-3 tabular-nums whitespace-nowrap">
										{new Date(log.created_at).toLocaleString("fr-FR", {
											day: "2-digit",
											month: "2-digit",
											hour: "2-digit",
											minute: "2-digit",
										})}
									</td>
									<td className="px-2 py-4">
										<span className="font-mono text-[11px] tracking-wider uppercase px-2 py-1 bg-paper-2 rounded-full text-ink-3">
											{TYPE_LABELS[log.action_type] ?? log.action_type}
										</span>
									</td>
									<td className="px-2 py-4 font-mono text-[13px] text-ink">{log.action}</td>
									<td className="px-2 py-4 text-[15px] text-ink-2">
										{log.first_name ? `${log.first_name} ${log.last_name}` : <span className="text-ink-4">—</span>}
									</td>
									<td className="px-7 py-4 font-mono text-[11px] text-ink-4 max-w-[300px] truncate">
										{log.details ? JSON.stringify(log.details) : "—"}
									</td>
								</tr>
							))}
						</tbody>
					</table>
				)}
			</div>

			{totalPages > 1 && (
				<div className="flex items-center justify-between mt-5">
					<span className="font-mono text-[11px] tracking-wider uppercase text-ink-4">
						{total} entrée{total > 1 ? "s" : ""} &middot; page {page}/{totalPages}
					</span>
					<div className="flex gap-2">
						<button
							type="button"
							onClick={() => setPage((p) => Math.max(1, p - 1))}
							disabled={page === 1}
							className="px-4 py-2 border border-sand rounded-[10px] font-mono text-[11px] tracking-wider uppercase text-ink-2 hover:bg-paper-2 disabled:opacity-40 cursor-pointer"
						>
							Préc.
						</button>
						<button
							type="button"
							onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
							disabled={page === totalPages}
							className="px-4 py-2 border border-sand rounded-[10px] font-mono text-[11px] tracking-wider uppercase text-ink-2 hover:bg-paper-2 disabled:opacity-40 cursor-pointer"
						>
							Suiv.
						</button>
					</div>
				</div>
			)}
		</div>
	);
};

export default React.memo(LogsPage);
