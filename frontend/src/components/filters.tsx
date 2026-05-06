import React, { useEffect, useState } from "react";
import AuthenticationService from "../services/authentification_service";
import { ADMIN_ROLES, formatTodayDate } from "../constants";

interface FiltersProps {
	onDateChange: (date: string) => void;
}

const Filters: React.FC<FiltersProps> = ({ onDateChange }) => {
	const [selectedDate, setSelectedDate] = useState<string>(formatTodayDate());
	const [isAdmin, setIsAdmin] = useState<boolean>(false);
	const [error, setError] = useState<string>("");

	useEffect(() => {
		const checkUserRole = async () => {
			try {
				const user = await AuthenticationService.getCurrentUser();
				if (!user) {
					setError("User not authenticated");
					return;
				}
				setIsAdmin(ADMIN_ROLES.includes(user.role));
			} catch {
				setError("Error checking user role");
			}
		};

		checkUserRole();
	}, []);

	const handleDateChange = (date: string) => {
		setSelectedDate(date);
		onDateChange(date);
	};

	return (
		<div className="bg-white p-4 shadow-md rounded-md">
			{error && <div className="text-red-500 mb-4">{error}</div>}
			<div className="flex flex-col md:flex-row gap-4">
				<div className="w-full">
					<label htmlFor="date-input" className="block text-gray-700 mb-2">Date :</label>
					<input
						id="date-input"
						type="date"
						value={selectedDate}
						max={formatTodayDate()}
						disabled={!isAdmin}
						className="w-full p-2 border rounded-md"
						onChange={(e) => handleDateChange(e.target.value)}
					/>
					{!isAdmin && (
						<p className="text-sm text-gray-500 mt-1">
							Seuls les développeurs et gérants peuvent sélectionner des dates
							antérieures
						</p>
					)}
				</div>
			</div>
		</div>
	);
};

export default Filters;
