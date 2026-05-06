import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { EyeIcon, EyeOffIcon } from "lucide-react";
import { z } from "zod";
import { useToast } from "../components/toast";
import userService from "../services/user_service";

const userSchema = z.object({
	first_name: z.string().min(2, "Le prénom doit contenir au moins 2 caractères"),
	last_name: z.string().min(2, "Le nom doit contenir au moins 2 caractères"),
	email: z.string().email("Email invalide"),
	password: z
		.string()
		.min(8, "Le mot de passe doit contenir au moins 8 caractères")
		.regex(/[A-Z]/, "Le mot de passe doit contenir au moins une majuscule")
		.regex(/[0-9]/, "Le mot de passe doit contenir au moins un chiffre"),
	postal_address: z.string().optional(),
	phone_number: z
		.string()
		.regex(/^(\+33|0)[1-9](\d{2}){4}$/, "Format de téléphone français invalide")
		.optional()
		.or(z.literal("")),
	hire_date: z.string().min(1, "La date d'embauche est requise"),
	id_role: z.number().positive("Le rôle est requis"),
});

interface UserFormData {
	first_name: string;
	last_name: string;
	email: string;
	password: string;
	postal_address: string;
	phone_number: string;
	hire_date: string;
	id_role: number;
}

const AddUser: React.FC = () => {
	const navigate = useNavigate();
	const { showToast } = useToast();
	const [showPassword, setShowPassword] = useState(false);
	const [errors, setErrors] = useState<Record<string, string>>({});
	const [loading, setLoading] = useState(false);

	const today = new Date().toISOString().split("T")[0];

	const [formData, setFormData] = useState<UserFormData>({
		first_name: "",
		last_name: "",
		email: "",
		password: "",
		postal_address: "",
		phone_number: "",
		hire_date: today,
		id_role: 4,
	});

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setErrors({});

		const result = userSchema.safeParse(formData);
		if (!result.success) {
			const fieldErrors: Record<string, string> = {};
			for (const err of result.error.errors) {
				const field = err.path[0] as string;
				fieldErrors[field] = err.message;
			}
			setErrors(fieldErrors);
			return;
		}

		setLoading(true);
		try {
			await userService.create(formData);
			showToast("Utilisateur créé avec succès", "success");
			navigate("/users");
		} catch {
			showToast("Erreur lors de la création de l'utilisateur", "error");
		} finally {
			setLoading(false);
		}
	};

	const fieldError = (field: string) =>
		errors[field] ? <p className="text-red-500 text-xs mt-1">{errors[field]}</p> : null;

	return (
		<div className="min-h-screen flex flex-col p-4">
			<div className="flex-grow p-2 md:p-6">
				<h1 className="text-2xl font-bold mb-6">Ajouter un employé</h1>
				<form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-6 space-y-4">
					<div>
						<label htmlFor="last_name" className="block text-sm font-medium mb-1">Nom *</label>
						<input id="last_name" type="text" value={formData.last_name} onChange={(e) => setFormData({ ...formData, last_name: e.target.value })} className="w-full p-2 border rounded-md" required />
						{fieldError("last_name")}
					</div>
					<div>
						<label htmlFor="first_name" className="block text-sm font-medium mb-1">Prénom *</label>
						<input id="first_name" type="text" value={formData.first_name} onChange={(e) => setFormData({ ...formData, first_name: e.target.value })} className="w-full p-2 border rounded-md" required />
						{fieldError("first_name")}
					</div>
					<div>
						<label htmlFor="email" className="block text-sm font-medium mb-1">Email *</label>
						<input id="email" type="email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} className="w-full p-2 border rounded-md" required />
						{fieldError("email")}
					</div>
					<div>
						<label htmlFor="password" className="block text-sm font-medium mb-1">Mot de passe *</label>
						<div className="relative">
							<input id="password" type={showPassword ? "text" : "password"} value={formData.password} onChange={(e) => setFormData({ ...formData, password: e.target.value })} className="w-full p-2 border rounded-md pr-10" required />
							<button type="button" aria-label="Afficher le mot de passe" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500">
								{showPassword ? <EyeOffIcon size={20} /> : <EyeIcon size={20} />}
							</button>
						</div>
						<p className="text-xs text-gray-500 mt-1">Min. 8 caractères, 1 majuscule, 1 chiffre</p>
						{fieldError("password")}
					</div>
					<div>
						<label htmlFor="address" className="block text-sm font-medium mb-1">Adresse</label>
						<input id="address" type="text" value={formData.postal_address} onChange={(e) => setFormData({ ...formData, postal_address: e.target.value })} className="w-full p-2 border rounded-md" />
					</div>
					<div>
						<label htmlFor="telephone" className="block text-sm font-medium mb-1">Téléphone</label>
						<input id="telephone" type="tel" value={formData.phone_number} onChange={(e) => setFormData({ ...formData, phone_number: e.target.value })} className="w-full p-2 border rounded-md" placeholder="0612345678" />
						{fieldError("phone_number")}
					</div>
					<div>
						<label htmlFor="hire_date" className="block text-sm font-medium mb-1">Date d'embauche *</label>
						<input id="hire_date" type="date" value={formData.hire_date} onChange={(e) => setFormData({ ...formData, hire_date: e.target.value })} className="w-full p-2 border rounded-md" required />
						{fieldError("hire_date")}
					</div>
					<div>
						<label htmlFor="role" className="block text-sm font-medium mb-1">Rôle *</label>
						<select id="role" value={formData.id_role} onChange={(e) => setFormData({ ...formData, id_role: Number.parseInt(e.target.value) })} className="w-full p-2 border rounded-md" required>
							<option value="">Sélectionner un rôle</option>
							<option value="1">Développeur</option>
							<option value="2">Gérant</option>
							<option value="3">Responsable</option>
							<option value="4">Serveur</option>
						</select>
					</div>
					<div className="flex justify-end space-x-4">
						<button type="button" aria-label="Annuler" onClick={() => navigate("/users")} className="px-4 py-2 border rounded-md hover:bg-gray-100">Annuler</button>
						<button type="submit" aria-label="Sauvegarder" disabled={loading} className="px-4 py-2 bg-cyan-600 text-white rounded-md hover:bg-cyan-700 disabled:opacity-50">
							{loading ? "Enregistrement..." : "Sauvegarder"}
						</button>
					</div>
				</form>
			</div>
		</div>
	);
};

export default AddUser;
