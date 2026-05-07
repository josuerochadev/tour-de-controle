import React from "react";

interface InfoFieldProps {
	label: string;
	value?: string | number;
	className?: string;
}

const InfoField: React.FC<InfoFieldProps> = ({ label, value, className = "" }) => (
	<div className="flex border-b border-sand pb-3">
		<span className="w-1/3 font-mono text-[11px] tracking-[1.5px] uppercase text-ink-4 pt-0.5">{label}</span>
		<span className={`w-2/3 text-ink ${className}`}>{value || "Non renseigne"}</span>
	</div>
);

export default InfoField;
