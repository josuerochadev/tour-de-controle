import React, { useEffect, useState } from "react";
import { FaQuestionCircle, FaSignOutAlt, FaUserCircle } from "react-icons/fa";
import AuthenticationService from "../services/authentification_service";
import type { AuthUser } from "../types/user";

interface HeaderProps {
	onLogout: () => void;
}

const ProfileModal: React.FC<{
	isOpen: boolean;
	onClose: () => void;
	user: AuthUser | null;
}> = ({ isOpen, onClose, user }) => {
	if (!isOpen || !user) return null;

	return (
		<div className="absolute top-16 right-20 mt-2 z-50">
			<div className="bg-white rounded-lg p-6 w-96 border-2 border-cyan-600">
				<div className="flex justify-between items-center mb-4">
					<h2 className="text-xl font-bold text-cyan-600">Mon Profil</h2>
					<button type="button" aria-label="Fermer le profil" onClick={onClose} className="text-cyan-600 hover:text-cyan-700">
						✕
					</button>
				</div>
				<div className="space-y-4">
					<div>
						<span className="font-semibold text-cyan-600">Prénom:</span>
						<p className="text-cyan-700">{user.first_name}</p>
					</div>
					<div>
						<span className="font-semibold text-cyan-600">Nom:</span>
						<p className="text-cyan-700">{user.last_name}</p>
					</div>
					<div>
						<span className="font-semibold text-cyan-600">Email:</span>
						<p className="text-cyan-700">{user.email}</p>
					</div>
				</div>
			</div>
		</div>
	);
};

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
					<FaQuestionCircle className="text-2xl cursor-pointer hover:text-gray-200" title="Aide" aria-label="Aide" />
					<FaUserCircle className="text-2xl cursor-pointer hover:text-gray-200" onClick={() => setIsProfileOpen(!isProfileOpen)} title="Profil" aria-label="Mon profil" />
					<FaSignOutAlt className="text-2xl cursor-pointer hover:text-gray-200" onClick={onLogout} title="Déconnexion" aria-label="Se déconnecter" />
				</div>
			</header>
			<ProfileModal isOpen={isProfileOpen} onClose={() => setIsProfileOpen(false)} user={user} />
		</>
	);
};

export default Header;
