import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import AuthenticationService from "../services/authentification_service";

interface User {
	id_user: number;
	first_name: string;
	last_name: string;
	email: string;
	postal_address: string;
	phone_number: string;
	hire_date: string;
	is_active: boolean;
	id_role: number;
}

const ViewUser = () => {
	const { id } = useParams();
	const navigate = useNavigate();
	const [user, setUser] = useState<User | null>(null);

	useEffect(() => {
		const fetchUser = async () => {
			try {
				const response = await axios.get(
					`${import.meta.env.VITE_API_BASE_URL}/users/${id}`,
					{ headers: AuthenticationService.getAuthHeader() },
				);
				setUser(response.data);
			} catch (error) {
				console.error("Error fetching data:", error);
				navigate("/users");
			}
		};

		fetchUser();
	}, [id, navigate]);

	if (!user) return null;

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
							value={
								user.hire_date && new Date(user.hire_date).toLocaleDateString()
							}
						/>
						<InfoField
							label="Actif"
							value={user.is_active ? "✓" : "✗"}
							className={user.is_active ? "text-green-600" : "text-red-600"}
						/>
					</div>

					<div className="mt-8 flex justify-end space-x-4">
						<button
							aria-label="Retour"
							type="button"
							onClick={() => navigate("/users")}
							className="px-4 py-2 border rounded-md hover:bg-gray-100"
						>
							Retour
						</button>
						<button
							aria-label="Modifier"
							type="button"
							onClick={() => navigate(`/users/edit/${user.id_user}`)}
							className="px-4 py-2 bg-cyan-600 text-white rounded-md hover:bg-cyan-700"
						>
							Modifier
						</button>
					</div>
				</div>
			</div>
		</div>
	);
};

const InfoField = ({
	label,
	value,
	className = "",
}: {
	label: string;
	value?: string | number;
	className?: string;
}) => (
	<div className="flex border-b pb-2">
		<span className="w-1/3 text-gray-600">{label}</span>
		<span className={`w-2/3 ${className}`}>{value || "Non renseigné"}</span>
	</div>
);

const getRoleName = (roleId: number) => {
	const roles = {
		1: "Développeur",
		2: "Gérant",
		3: "Responsable",
		4: "Serveur",
	};
	return roles[roleId as keyof typeof roles] || "Inconnu";
};

export default ViewUser;
