import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useToast } from "../components/toast";
import InfoField from "../components/info_field";
import userService from "../services/user_service";
import type { User } from "../types/user";
import { ROLE_LABELS } from "../constants";

const ViewUser = () => {
	const { id } = useParams();
	const navigate = useNavigate();
	const { showToast } = useToast();
	const [user, setUser] = useState<User | null>(null);

	useEffect(() => {
		const fetchUser = async () => {
			try {
				const data = await userService.getById(Number(id));
				setUser(data);
			} catch {
				showToast("Utilisateur introuvable", "error");
				navigate("/users");
			}
		};
		fetchUser();
	}, [id, navigate]);

	if (!user) return null;

	const getRoleName = (roleId: number) => ROLE_LABELS[roleId] || "Inconnu";

	return (
		<div className="max-w-[720px] mx-auto">
			<div className="font-mono text-[11px] tracking-[2px] uppercase text-ink-4">// Equipage &middot; fiche membre</div>

			<div className="mt-4 bg-paper-soft border border-sand rounded-3xl p-8">
				{/* Avatar + Name */}
				<div className="flex items-center gap-5 mb-8">
					<div className="w-16 h-16 rounded-full bg-ink text-paper flex items-center justify-center font-display text-xl font-semibold">
						{user.first_name[0]}{user.last_name[0]}
					</div>
					<div>
						<h1 className="font-display text-2xl font-semibold uppercase tracking-tight leading-tight">
							{user.first_name} {user.last_name}
						</h1>
						<div className="font-mono text-[11px] text-ink-4 tracking-wider mt-1">ID #{user.id_user}</div>
					</div>
				</div>

				<div className="space-y-4">
					<InfoField label="Nom" value={user.last_name} />
					<InfoField label="Prenom" value={user.first_name} />
					<InfoField label="Role" value={getRoleName(user.id_role)} />
					<InfoField label="Email" value={user.email} />
					<InfoField label="Adresse" value={user.postal_address} />
					<InfoField label="Telephone" value={user.phone_number} />
					<InfoField
						label="Date d'embauche"
						value={user.hire_date && new Date(user.hire_date).toLocaleDateString("fr-FR")}
					/>
					<InfoField
						label="Actif"
						value={user.is_active ? "Oui" : "Non"}
						className={user.is_active ? "text-ok" : "text-signal"}
					/>
				</div>

				<div className="mt-8 flex justify-end gap-3">
					<button aria-label="Retour" type="button" onClick={() => navigate("/users")} className="px-5 py-3 border border-sand rounded-2xl font-display text-xs font-semibold tracking-wider uppercase cursor-pointer hover:bg-paper-2 transition-colors bg-transparent">
						Retour
					</button>
					<button aria-label="Modifier" type="button" onClick={() => navigate(`/users/edit/${user.id_user}`)} className="px-5 py-3 bg-ink text-paper rounded-2xl border-none font-display text-xs font-semibold tracking-wider uppercase cursor-pointer hover:bg-ink-2 transition-colors">
						Modifier
					</button>
				</div>
			</div>
		</div>
	);
};

export default ViewUser;
