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
		<div className="absolute top-20 right-8 z-50">
			<div className="bg-paper-soft rounded-3xl p-6 w-80 border border-sand">
				<div className="flex justify-between items-center mb-4">
					<h2 className="font-display text-sm font-semibold tracking-wider uppercase text-ink">Mon profil</h2>
					<button type="button" aria-label="Fermer le profil" onClick={onClose} className="text-ink-4 hover:text-signal bg-transparent border-none cursor-pointer text-lg">
						&#x2715;
					</button>
				</div>
				<div className="space-y-4">
					<div>
						<span className="font-mono text-[11px] tracking-[1.5px] uppercase text-ink-4">Prenom</span>
						<p className="text-ink mt-1">{user.first_name}</p>
					</div>
					<div>
						<span className="font-mono text-[11px] tracking-[1.5px] uppercase text-ink-4">Nom</span>
						<p className="text-ink mt-1">{user.last_name}</p>
					</div>
					<div>
						<span className="font-mono text-[11px] tracking-[1.5px] uppercase text-ink-4">Email</span>
						<p className="text-ink mt-1">{user.email}</p>
					</div>
				</div>
			</div>
		</div>
	);
};

export default ProfileModal;
