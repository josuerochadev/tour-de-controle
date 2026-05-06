import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useToast } from "../components/toast";
import userService from "../services/user_service";
import { ROLES, ROLE_LABELS, formatDateToISO } from "../constants";

interface UserFormData {
	first_name: string;
	last_name: string;
	email: string;
	postal_address: string;
	phone_number: string;
	hire_date: string;
	id_role: number;
}

const EditUser: React.FC = () => {
	const { id } = useParams();
	const navigate = useNavigate();
	const { showToast } = useToast();
	const [loading, setLoading] = useState(false);
	const [formData, setFormData] = useState<UserFormData>({
		first_name: "",
		last_name: "",
		email: "",
		postal_address: "",
		phone_number: "",
		hire_date: "",
		id_role: ROLES.SERVER,
	});

	useEffect(() => {
		const fetchUser = async () => {
			try {
				const user = await userService.getById(Number(id));
				setFormData({
					...user,
					postal_address: user.postal_address || "",
					phone_number: user.phone_number || "",
					hire_date: formatDateToISO(user.hire_date),
				});
			} catch {
				showToast("Utilisateur introuvable", "error");
				navigate("/users");
			}
		};
		fetchUser();
	}, [id, navigate]);

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setLoading(true);
		try {
			await userService.update(Number(id), formData);
			showToast("Utilisateur modifié avec succès", "success");
			navigate("/users");
		} catch {
			showToast("Erreur lors de la modification", "error");
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className="min-h-screen flex flex-col p-4">
			<div className="flex-grow p-2 md:p-6">
				<h1 className="text-2xl font-bold mb-6">Modifier un employé</h1>
				<form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-6 space-y-4">
					<div>
						<label htmlFor="last_name" className="block text-sm font-medium mb-1">Nom</label>
						<input id="last_name" type="text" value={formData.last_name} onChange={(e) => setFormData({ ...formData, last_name: e.target.value })} className="w-full p-2 border rounded-md" required />
					</div>
					<div>
						<label htmlFor="first_name" className="block text-sm font-medium mb-1">Prénom</label>
						<input id="first_name" type="text" value={formData.first_name} onChange={(e) => setFormData({ ...formData, first_name: e.target.value })} className="w-full p-2 border rounded-md" required />
					</div>
					<div>
						<label htmlFor="email" className="block text-sm font-medium mb-1">Email</label>
						<input id="email" type="email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} className="w-full p-2 border rounded-md" required />
					</div>
					<div>
						<label htmlFor="postal_address" className="block text-sm font-medium mb-1">Adresse</label>
						<input id="postal_address" type="text" value={formData.postal_address} onChange={(e) => setFormData({ ...formData, postal_address: e.target.value })} className="w-full p-2 border rounded-md" />
					</div>
					<div>
						<label htmlFor="phone_number" className="block text-sm font-medium mb-1">Téléphone</label>
						<input id="phone_number" type="tel" value={formData.phone_number} onChange={(e) => setFormData({ ...formData, phone_number: e.target.value })} className="w-full p-2 border rounded-md" />
					</div>
					<div>
						<label htmlFor="hire_date" className="block text-sm font-medium mb-1">Date d'embauche</label>
						<input id="hire_date" type="date" value={formData.hire_date} onChange={(e) => setFormData({ ...formData, hire_date: e.target.value })} className="w-full p-2 border rounded-md" required />
					</div>
					<div>
						<label htmlFor="id_role" className="block text-sm font-medium mb-1">Rôle</label>
						<select id="id_role" value={formData.id_role} onChange={(e) => setFormData({ ...formData, id_role: Number.parseInt(e.target.value) })} className="w-full p-2 border rounded-md" required>
							<option value="">Sélectionner un rôle</option>
							{Object.entries(ROLE_LABELS).map(([id, label]) => (
								<option key={id} value={id}>{label}</option>
							))}
						</select>
					</div>
					<div className="flex justify-end space-x-4">
						<button type="button" onClick={() => navigate("/users")} className="px-4 py-2 border rounded-md hover:bg-gray-100">Annuler</button>
						<button type="submit" disabled={loading} className="px-4 py-2 bg-cyan-600 text-white rounded-md hover:bg-cyan-700 disabled:opacity-50">
							{loading ? "Enregistrement..." : "Sauvegarder"}
						</button>
					</div>
				</form>
			</div>
		</div>
	);
};

export default EditUser;
