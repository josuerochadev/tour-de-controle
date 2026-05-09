import React from "react";

interface LogoIconProps {
	size?: number;
	className?: string;
}

/** Decorative logo SVG. Always aria-hidden — use surrounding text for context. */
const LogoIcon: React.FC<LogoIconProps> = ({ size = 32, className = "" }) => (
	<svg width={size} height={size} viewBox="0 0 64 64" aria-hidden="true" className={className}>
		<path d="M32 18 L52 8 L52 28 Z" fill="#f59e0b" opacity="0.55" />
		<path d="M32 18 L12 8 L12 28 Z" fill="#f59e0b" opacity="0.55" />
		<path d="M24 22 L40 22 L42 56 L22 56 Z" fill="currentColor" />
		<rect x="26" y="14" width="12" height="10" rx="1.5" fill="currentColor" />
		<circle cx="32" cy="19" r="3" fill="#dc2626" />
		<path d="M28 14 L36 14 L34 10 L30 10 Z" fill="currentColor" />
		<circle cx="32" cy="9" r="1.5" fill="currentColor" />
		<rect x="24" y="36" width="18" height="4" fill="#dc2626" />
		<rect x="20" y="56" width="24" height="3" rx="1" fill="currentColor" />
	</svg>
);

export default LogoIcon;
