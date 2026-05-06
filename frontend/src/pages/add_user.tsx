import React from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import AuthenticationService from "../services/authentification_service";
import { EyeIcon, EyeOffIcon } from "lucide-react";

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
	const [showPassword, setShowPassword] = useState(false);

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
		try {
			await axios.post(`${import.meta.env.VITE_API_BASE_URL}/users`, formData, {
				headers: AuthenticationService.getAuthHeader(),
			});
			navigate("/users");
		} catch (error) {
			console.error("Error creating user:", error);
		}
	};

	return (
		<div className="min-h-screen flex flex-col p-4">
			<div className="flex-grow p-2 md:p-6">
				<h1 className="text-2xl font-bold mb-6">Ajouter un employé</h1>
				<form
					onSubmit={handleSubmit}
					className="bg-white rounded-lg shadow-md p-6 space-y-4"
				>
					<div>
						<label
							htmlFor="last_name"
							className="block text-sm font-medium mb-1"
						>
							Nom
						</label>
						<input
							id="last_name"
							type="text"
							value={formData.last_name}
							onChange={(e) =>
								setFormData({ ...formData, last_name: e.target.value })
							}
							className="w-full p-2 border rounded-md"
							required
						/>
					</div>
					<div>
						<label
							htmlFor="first_name"
							className="block text-sm font-medium mb-1"
						>
							Prénom
						</label>
						<input
							id="first_name"
							type="text"
							value={formData.first_name}
							onChange={(e) =>
								setFormData({ ...formData, first_name: e.target.value })
							}
							className="w-full p-2 border rounded-md"
							required
						/>
					</div>
					<div>
						<label htmlFor="email" className="block text-sm font-medium mb-1">
							Email
						</label>
						<input
							id="email"
							type="email"
							value={formData.email}
							onChange={(e) =>
								setFormData({ ...formData, email: e.target.value })
							}
							className="w-full p-2 border rounded-md"
							required
						/>
					</div>
					<div>
						<label
							htmlFor="password"
							className="block text-sm font-medium mb-1"
						>
							Mot de passe
						</label>
						<div className="relative">
							<input
								id="password"
								type={showPassword ? "text" : "password"}
								value={formData.password}
								onChange={(e) =>
									setFormData({ ...formData, password: e.target.value })
								}
								className="w-full p-2 border rounded-md pr-10"
								required
							/>
							<button
								type="button"
								aria-label="Toggle password visibility"
								onClick={() => setShowPassword(!showPassword)}
								className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
							>
								{showPassword ? (
									<EyeOffIcon size={30} />
								) : (
									<EyeIcon size={30} />
								)}
							</button>
						</div>
					</div>
					<div>
						<label htmlFor="address" className="block text-sm font-medium mb-1">
							Adresse
						</label>
						<input
							id="address"
							type="text"
							value={formData.postal_address}
							onChange={(e) =>
								setFormData({ ...formData, postal_address: e.target.value })
							}
							className="w-full p-2 border rounded-md"
						/>
					</div>
					<div>
						<label
							htmlFor="telephone"
							className="block text-sm font-medium mb-1"
						>
							Téléphone
						</label>
						<input
							id="telephone"
							type="tel"
							value={formData.phone_number}
							onChange={(e) =>
								setFormData({ ...formData, phone_number: e.target.value })
							}
							className="w-full p-2 border rounded-md"
						/>
					</div>
					<div>
						<label
							htmlFor="hire_date"
							className="block text-sm font-medium mb-1"
						>
							Date d'embauche
						</label>
						<input
							id="hire_date"
							type="date"
							value={formData.hire_date}
							onChange={(e) =>
								setFormData({ ...formData, hire_date: e.target.value })
							}
							className="w-full p-2 border rounded-md"
							required
						/>
					</div>
					<div>
						<label htmlFor="role" className="block text-sm font-medium mb-1">
							Rôle
						</label>
						<select
							id="role"
							value={formData.id_role}
							onChange={(e) =>
								setFormData({
									...formData,
									id_role: Number.parseInt(e.target.value),
								})
							}
							className="w-full p-2 border rounded-md"
							required
						>
							<option value="">Sélectionner un rôle</option>
							<option value="1">Développeur</option>
							<option value="2">Gérant</option>
							<option value="3">Responsable</option>
							<option value="4">Serveur</option>
						</select>
					</div>
					<div className="flex justify-end space-x-4">
						<button
							type="button"
							aria-label="Annuler"
							onClick={() => navigate("/users")}
							className="px-4 py-2 border rounded-md hover:bg-gray-100"
						>
							Annuler
						</button>
						<button
							type="submit"
							aria-label="Sauvegarder"
							className="px-4 py-2 bg-cyan-600 text-white rounded-md hover:bg-cyan-700"
						>
							Sauvegarder
						</button>
					</div>
				</form>
			</div>
		</div>
	);
};

export default AddUser;
