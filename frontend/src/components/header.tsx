import React, { useState } from "react";
import { useLocation, Link } from "react-router-dom";
import { useAuth } from "../contexts/auth_context";
import ProfileModal from "./profile_modal";

interface HeaderProps {
	onLogout: () => void;
}

const NAV_ITEMS = [
	{ id: "/dashboard", label: "Vigie" },
	{ id: "/cash-register", label: "Caisse" },
	{ id: "/transactions", label: "Flux" },
	{ id: "/users", label: "Equipage" },
];

const Logo = ({ size = 32 }: { size?: number }) => (
	<svg width={size} height={size} viewBox="0 0 64 64" aria-hidden="true">
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

/** Main application header with navigation, user info, and logout action. */
const Header: React.FC<HeaderProps> = ({ onLogout }) => {
	const { user } = useAuth();
	const [isProfileOpen, setIsProfileOpen] = useState(false);
	const location = useLocation();

	const currentPath = location.pathname;

	return (
		<>
			<header className="flex items-center justify-between px-8 py-5 border-b border-sand bg-paper">
				{/* Wordmark */}
				<div className="flex items-center gap-3 text-ink">
					<Logo size={36} />
					<div className="flex flex-col leading-none whitespace-nowrap">
						<span className="font-display text-sm font-semibold tracking-wider">TOUR DE CONTROLE</span>
						<span className="font-mono text-[10px] tracking-[2px] uppercase text-ink-4 mt-1">Restaurant ops</span>
					</div>
				</div>

				{/* Nav pills */}
				<nav aria-label="Navigation principale" className="hidden md:flex gap-1 p-1 bg-paper-2 rounded-full">
					{NAV_ITEMS.map((item) => {
						const isActive = currentPath.startsWith(item.id);
						return (
							<Link
								key={item.id}
								to={item.id}
								aria-current={isActive ? "page" : undefined}
								className={`px-5 py-2.5 rounded-full font-display text-xs font-semibold tracking-wider uppercase transition-colors duration-200 no-underline ${
									isActive
										? "bg-ink text-paper"
										: "text-ink-2 hover:text-ink"
								}`}
							>
								{item.label}
							</Link>
						);
					})}
				</nav>

				{/* User area */}
				<div className="flex items-center gap-3.5">
					<div className="text-right leading-tight hidden md:block">
						<div className="text-sm text-ink font-medium">
							{user ? `${user.first_name} ${user.last_name}` : ""}
						</div>
						<div className="font-mono text-[10px] text-ink-4 tracking-[1.5px] uppercase mt-0.5">
							De garde
						</div>
					</div>
					<button
						type="button"
						aria-label="Mon profil"
						onClick={() => setIsProfileOpen(!isProfileOpen)}
						className="w-[38px] h-[38px] rounded-full bg-ink text-paper flex items-center justify-center font-display text-[13px] font-semibold cursor-pointer border-none"
					>
						{user ? `${user.first_name[0]}${user.last_name[0]}` : ""}
					</button>
					<button
						type="button"
						onClick={onLogout}
						aria-label="Quitter le quart"
						className="bg-transparent border-none cursor-pointer text-ink-4 font-mono text-[11px] tracking-wider uppercase hover:text-signal transition-colors duration-200"
					>
						Quitter
					</button>
				</div>
			</header>

			{/* Mobile nav */}
			<nav aria-label="Navigation mobile" className="md:hidden flex gap-1 p-2 bg-paper-2 border-b border-sand overflow-x-auto">
				{NAV_ITEMS.map((item) => {
					const isActive = currentPath.startsWith(item.id);
					return (
						<Link
							key={item.id}
							to={item.id}
							aria-current={isActive ? "page" : undefined}
							className={`px-4 py-2 rounded-full font-display text-[11px] font-semibold tracking-wider uppercase whitespace-nowrap no-underline ${
								isActive
									? "bg-ink text-paper"
									: "text-ink-2"
							}`}
						>
							{item.label}
						</Link>
					);
				})}
			</nav>

			<ProfileModal isOpen={isProfileOpen} onClose={() => setIsProfileOpen(false)} user={user} />
		</>
	);
};

export default Header;
