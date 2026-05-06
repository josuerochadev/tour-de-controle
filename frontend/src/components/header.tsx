import React, { useEffect, useState } from "react";
import { FaQuestionCircle, FaSignOutAlt, FaUserCircle } from "react-icons/fa";
import AuthenticationService from "../services/authentification_service";
import type { AuthUser } from "../types/user";
import ProfileModal from "./profile_modal";

interface HeaderProps {
	onLogout: () => void;
}

const Header: React.FC<HeaderProps> = ({ onLogout }) => {
	const [user, setUser] = useState<AuthUser | null>(null);
	const [isProfileOpen, setIsProfileOpen] = useState(false);

	useEffect(() => {
		AuthenticationService.getCurrentUser().then((userData) => {
			if (userData) setUser(userData);
		});
	}, []);

	return (
		<>
			<header className="fixed top-0 left-0 w-full bg-cyan-600 text-white p-4 flex justify-between items-center shadow-md z-40">
				<div className="flex items-center">
					<img src="/LogoLaTourDeControle.png" alt="La Tour de Contrôle" className="h-10 mr-3" />
					<span className="text-lg font-semibold">La Tour de Contrôle</span>
				</div>
				<div className="flex items-center space-x-4">
					<span className="hidden md:inline text-lg font-medium">
						Bonjour, {user ? `${user.first_name} ${user.last_name}` : ""}
					</span>
					<button type="button" aria-label="Aide" title="Aide" className="text-2xl cursor-pointer hover:text-gray-200 bg-transparent border-none text-white">
						<FaQuestionCircle aria-hidden="true" />
					</button>
					<button type="button" aria-label="Mon profil" title="Profil" onClick={() => setIsProfileOpen(!isProfileOpen)} className="text-2xl cursor-pointer hover:text-gray-200 bg-transparent border-none text-white">
						<FaUserCircle aria-hidden="true" />
					</button>
					<button type="button" aria-label="Se déconnecter" title="Déconnexion" onClick={onLogout} className="text-2xl cursor-pointer hover:text-gray-200 bg-transparent border-none text-white">
						<FaSignOutAlt aria-hidden="true" />
					</button>
				</div>
			</header>
			<ProfileModal isOpen={isProfileOpen} onClose={() => setIsProfileOpen(false)} user={user} />
		</>
	);
};

export default Header;
