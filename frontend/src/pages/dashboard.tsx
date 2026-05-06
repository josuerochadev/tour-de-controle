import React from "react";
import Filters from "../components/filters";

const Dashboard: React.FC = () => {
	const handleDateChange = (date: string) => {
		// Handle date change
		console.log("Selected date:", date);
	};

	return (
		<div className="min-h-screen flex flex-col p-4">
			<Filters onDateChange={handleDateChange} />
		</div>
	);
};

export default Dashboard;
