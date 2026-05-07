import React, { useState } from "react";
import { useAuth } from "../contexts/auth_context";
import { ADMIN_ROLES, formatTodayDate } from "../constants";

interface FiltersProps {
	onDateChange: (date: string) => void;
}

/** Date filter component. Only admin roles can select past dates. */
const Filters: React.FC<FiltersProps> = ({ onDateChange }) => {
	const { user } = useAuth();
	const [selectedDate, setSelectedDate] = useState<string>(formatTodayDate());
	const isAdmin = user ? ADMIN_ROLES.includes(user.role) : false;

	const handleDateChange = (date: string) => {
		setSelectedDate(date);
		onDateChange(date);
	};

	return (
		<div className="p-5 bg-paper-soft border border-sand rounded-3xl">
			<div className="flex flex-col md:flex-row gap-3 items-start md:items-center">
				<label htmlFor="date-input" className="font-mono text-[11px] tracking-[2px] uppercase text-ink-4 whitespace-nowrap">Date :</label>
				<input
					id="date-input"
					type="date"
					value={selectedDate}
					max={formatTodayDate()}
					disabled={!isAdmin}
					className="py-2.5 px-4 border border-sand rounded-[14px] bg-paper font-mono text-sm text-ink outline-none focus:ring-2 focus:ring-signal tabular-nums disabled:opacity-50"
					onChange={(e) => handleDateChange(e.target.value)}
				/>
				{!isAdmin && (
					<p className="text-xs text-ink-4">
						Seuls les developpeurs et gerants peuvent selectionner des dates anterieures
					</p>
				)}
			</div>
		</div>
	);
};

export default Filters;
