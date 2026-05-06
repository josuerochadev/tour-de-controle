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
		<div className="min-h-screen flex flex-col p-4">
			<div className="flex-grow p-2 md:p-6">
				<div className="bg-white rounded-lg shadow-md p-6">
					<div className="mb-6">
						<h1 className="text-2xl font-bold">
							Fiche de {user.first_name} {user.last_name}
						</h1>
						<p className="text-md text-gray-600">Identifiant: {user.id_user}</p>
					</div>

					<div className="space-y-4">
						<InfoField label="Nom" value={user.last_name} />
						<InfoField label="Prénom" value={user.first_name} />
						<InfoField label="Rôle" value={getRoleName(user.id_role)} />
						<InfoField label="Email" value={user.email} />
						<InfoField label="Adresse" value={user.postal_address} />
						<InfoField label="Téléphone" value={user.phone_number} />
						<InfoField
							label="Date d'embauche"
							value={user.hire_date && new Date(user.hire_date).toLocaleDateString()}
						/>
						<InfoField
							label="Actif"
							value={user.is_active ? "Oui" : "Non"}
							className={user.is_active ? "text-green-600" : "text-red-600"}
						/>
					</div>

					<div className="mt-8 flex justify-end space-x-4">
						<button aria-label="Retour" type="button" onClick={() => navigate("/users")} className="px-4 py-2 border rounded-md hover:bg-gray-100">
							Retour
						</button>
						<button aria-label="Modifier" type="button" onClick={() => navigate(`/users/edit/${user.id_user}`)} className="px-4 py-2 bg-cyan-600 text-white rounded-md hover:bg-cyan-700">
							Modifier
						</button>
					</div>
				</div>
			</div>
		</div>
	);
};

export default ViewUser;
