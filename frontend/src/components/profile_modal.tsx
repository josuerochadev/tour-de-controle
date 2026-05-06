import React from "react";
import type { AuthUser } from "../types/user";

interface ProfileModalProps {
	isOpen: boolean;
	onClose: () => void;
	user: AuthUser | null;
}

const ProfileModal: React.FC<ProfileModalProps> = ({ isOpen, onClose, user }) => {
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

export default ProfileModal;
