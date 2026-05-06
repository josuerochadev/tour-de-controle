import React, { useEffect, useState } from "react";
import axios from "axios";
import AuthenticationService from "../services/authentification_service";
import { FaEye, FaEdit, FaTrash } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import Dialog from "../components/dialog";

interface User {
	id_user: number;
	first_name: string;
	last_name: string;
	email: string;
	phone_number: string;
	hire_date: string;
	is_active: boolean;
	role_name: string;
}

const UsersList: React.FC = () => {
	const navigate = useNavigate();
	const [users, setUsers] = useState<User[]>([]);
	const [search, setSearch] = useState("");

	const fetchUsers = async () => {
		try {
			const response = await axios.get(
				`${import.meta.env.VITE_API_BASE_URL}/users`,
				{
					headers: AuthenticationService.getAuthHeader(),
				},
			);
			setUsers(response.data);
		} catch (error) {
			console.error("Error fetching users:", error);
		}
	};

	useEffect(() => {
		fetchUsers();
	}, []);

	const handleDelete = async (userId: number) => {
		const result = await Dialog.show({
			title: "Confirmation",
			message: "Voulez-vous vraiment supprimer cet utilisateur ?",
			buttons: [
				{
					label: "Annuler",
					className: "px-4 py-2 border rounded-md hover:bg-gray-100",
				},
				{
					label: "Supprimer",
					className:
						"px-4 py-2 bg-cyan-600 text-white rounded-md hover:bg-cyan-700",
				},
			],
		});
		if (result) {
			try {
				await axios.delete(
					`${import.meta.env.VITE_API_BASE_URL}/users/${userId}`,
					{ headers: AuthenticationService.getAuthHeader() },
				);
				fetchUsers();
			} catch (error) {
				console.error("Error deleting user:", error);
			}
		}
	};

	const filteredUsers = users.filter((user) => {
		const searchTerm = search.toLowerCase();
		return (
			user.first_name.toLowerCase().includes(searchTerm) ||
			user.last_name.toLowerCase().includes(searchTerm) ||
			user.email.toLowerCase().includes(searchTerm) ||
			new Date(user.hire_date).toLocaleDateString().includes(searchTerm) ||
			user.phone_number?.includes(searchTerm)
		);
	});

	return (
		<div className="p-4 md:p-6 mb-16 ">
			<div className="flex flex-col md:flex-row justify-between items-center mb-4 gap-4">
				<h1 className="text-xl md:text-2xl font-bold">
					Liste des utilisateurs
				</h1>
				<button
					type="button"
					aria-label="Ajouter un utilisateur"
					onClick={() => navigate("/users/add")}
					className="w-full md:w-auto bg-cyan-600 text-white px-4 py-2 rounded-md hover:bg-cyan-700"
				>
					Ajouter un utilisateur
				</button>
			</div>

			<input
				type="text"
				placeholder="Rechercher par nom, prénom, email, téléphone ou date d'embauche..."
				className="w-full p-2 border rounded-md mb-4"
				value={search}
				onChange={(e) => setSearch(e.target.value)}
			/>

			<div className="overflow-x-auto bg-white rounded-lg shadow">
				<table className="min-w-full border-collapse">
					<thead className="text-center border-b bg-gray-100">
						<tr className="bg-gray-50 border-b">
							<th className="p-2 md:p-4 text-center">Nom</th>
							<th className="p-2 md:p-4 text-center">Prénom</th>
							<th className="p-2 md:p-4 text-center hidden md:table-cell">
								Email
							</th>
							<th className="p-2 md:p-4 text-center hidden md:table-cell">
								Date d'embauche
							</th>
							<th className="p-2 md:p-4 text-center">Actions</th>
						</tr>
					</thead>
					<tbody>
						{filteredUsers.map((user) => (
							<tr key={user.id_user} className="border-t hover:bg-gray-50">
								<td className="p-2 md:p-4 text-center">{user.last_name}</td>
								<td className="p-2 md:p-4 text-center">{user.first_name}</td>
								<td className="hidden md:table-cell p-2 md:p-4 text-center">
									{user.email}
								</td>
								<td className="hidden md:table-cell p-2 md:p-4 text-center">
									{new Date(user.hire_date).toLocaleDateString()}
								</td>
								<td className="p-2 md:p-4">
									<div className="md:hidden mb-2">
										<div className="text-sm text-gray-600">{user.email}</div>
										<div className="text-sm text-gray-600">
											{new Date(user.hire_date).toLocaleDateString()}
										</div>
									</div>

									<div className="flex justify-center space-x-2">
										<button
											aria-label="Voir détails"
											type="button"
											onClick={() => navigate(`/users/view/${user.id_user}`)}
											className="p-1 md:p-2 text-cyan-600 hover:text-cyan-700 border border-cyan-600 rounded-md"
											title="Voir détails"
										>
											<FaEye
												className="w-4 h-4 md:w-5 md:h-5"
												aria-hidden="true"
											/>
										</button>
										<button
											aria-label="Modifier"
											type="button"
											onClick={() => navigate(`/users/edit/${user.id_user}`)}
											className="p-1 md:p-2 text-cyan-600 hover:text-cyan-700 border border-cyan-600 rounded-md"
											title="Modifier"
										>
											<FaEdit
												className="w-4 h-4 md:w-5 md:h-5"
												aria-hidden="true"
											/>
										</button>
										<button
											aria-label="Supprimer"
											type="button"
											onClick={() => handleDelete(user.id_user)}
											className="p-1 md:p-2 text-red-600 hover:text-red-700 border border-red-600 rounded-md"
											title="Supprimer"
										>
											<FaTrash
												className="w-4 h-4 md:w-5 md:h-5"
												aria-hidden="true"
											/>
										</button>
									</div>
								</td>
							</tr>
						))}
					</tbody>
				</table>
			</div>
		</div>
	);
};

export default UsersList;
