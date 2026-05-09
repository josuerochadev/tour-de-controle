import React, { useState } from "react";
import { useLocation, Link } from "react-router-dom";
import { useAuth } from "../contexts/auth_context";
import ProfileModal from "./profile_modal";
import LogoIcon from "./logo_icon";

interface HeaderProps {
	onLogout: () => void;
}

const NAV_ITEMS = [
	{ id: "/dashboard", label: "Vigie" },
	{ id: "/cash-register", label: "Caisse" },
	{ id: "/transactions", label: "Flux" },
	{ id: "/users", label: "Equipage" },
];

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
					<LogoIcon size={36} />
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
