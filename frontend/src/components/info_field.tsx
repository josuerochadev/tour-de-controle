import React from "react";

interface InfoFieldProps {
	label: string;
	value?: string | number;
	className?: string;
}

const InfoField: React.FC<InfoFieldProps> = ({ label, value, className = "" }) => (
	<div className="flex border-b pb-2">
		<span className="w-1/3 text-gray-600">{label}</span>
		<span className={`w-2/3 ${className}`}>{value || "Non renseigné"}</span>
	</div>
);

export default InfoField;
