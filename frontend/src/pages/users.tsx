import React, { useEffect, useState, useMemo } from "react";
import { Eye, Pencil, Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useDialog } from "../components/dialog";
import { useToast } from "../components/toast";
import userService from "../services/user_service";
import type { User } from "../types/user";

const UsersList: React.FC = () => {
	const navigate = useNavigate();
	const { showDialog } = useDialog();
	const { showToast } = useToast();
	const [users, setUsers] = useState<User[]>([]);
	const [search, setSearch] = useState("");
	const [loading, setLoading] = useState(true);

	const fetchUsers = async () => {
		try {
			const result = await userService.getAll();
			setUsers(result.data);
		} catch {
			showToast("Erreur lors du chargement des utilisateurs", "error");
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		fetchUsers();
	}, []);

	const handleDelete = async (userId: number) => {
		const confirmed = await showDialog({
			title: "Confirmation",
			message: "Voulez-vous vraiment supprimer ce membre ?",
			buttons: [
				{ label: "Annuler", className: "px-5 py-3 border border-sand rounded-2xl font-display text-xs font-semibold tracking-wider uppercase cursor-pointer hover:bg-paper-2 transition-colors" },
				{ label: "Supprimer", className: "px-5 py-3 bg-signal text-paper rounded-2xl border-none font-display text-xs font-semibold tracking-wider uppercase cursor-pointer hover:bg-signal-deep transition-colors" },
			],
		});
		if (confirmed) {
			try {
				await userService.remove(userId);
				showToast("Membre supprime", "success");
				fetchUsers();
			} catch {
				showToast("Erreur lors de la suppression", "error");
			}
		}
	};

	const filteredUsers = useMemo(() => {
		const searchTerm = search.toLowerCase();
		return users.filter((user) =>
			user.first_name.toLowerCase().includes(searchTerm) ||
			user.last_name.toLowerCase().includes(searchTerm) ||
			user.email.toLowerCase().includes(searchTerm) ||
			new Date(user.hire_date).toLocaleDateString().includes(searchTerm) ||
			user.phone_number?.includes(searchTerm),
		);
	}, [users, search]);

	if (loading) {
		return (
			<div className="flex items-center justify-center py-20">
				<p className="font-mono text-ink-4 text-sm tracking-wider uppercase">Chargement...</p>
			</div>
		);
	}

	return (
		<div className="max-w-[1200px] mx-auto">
			{/* Page header */}
			<div className="mb-8">
				<div className="font-mono text-[11px] tracking-[2px] uppercase text-ink-4">// Personnel &middot; {users.length} membres</div>
				<h1 className="mt-2 font-display text-[56px] font-semibold leading-none tracking-tight uppercase">L'equipage</h1>
			</div>

			{/* Search + Add */}
			<div className="flex justify-between items-center mb-6 gap-4 flex-wrap">
				<input
					type="text"
					placeholder="Rechercher un membre..."
					className="flex-1 min-w-[280px] py-3.5 px-4 border border-sand rounded-[14px] bg-paper-soft font-sans text-base text-ink outline-none focus:ring-2 focus:ring-signal"
					value={search}
					onChange={(e) => setSearch(e.target.value)}
				/>
				<button
					type="button"
					aria-label="Embaucher"
					onClick={() => navigate("/users/add")}
					className="py-3.5 px-6 rounded-[14px] bg-ink text-paper border-none font-display text-xs font-semibold tracking-wider uppercase cursor-pointer hover:bg-ink-2 transition-colors duration-200"
				>
					+ Embaucher
				</button>
			</div>

			{/* User cards grid */}
			<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
				{filteredUsers.map((user) => (
					<div key={user.id_user} className="p-6 bg-paper-soft border border-sand rounded-3xl relative">
						{user.is_active && (
							<span className="absolute top-4 right-4 w-2 h-2 rounded-full bg-ok" />
						)}
						{/* Avatar */}
						<div className="w-14 h-14 rounded-full bg-ink text-paper flex items-center justify-center font-display text-lg font-semibold">
							{user.first_name[0]}{user.last_name[0]}
						</div>
						{/* Name */}
						<div className="mt-4 font-display text-xl font-semibold leading-tight uppercase tracking-tight">
							{user.first_name} {user.last_name}
						</div>
						{/* Email */}
						<div className="mt-4 pt-4 border-t border-sand text-xs text-ink-3">{user.email}</div>
						<div className="mt-1.5 font-mono text-[10px] text-ink-4 tracking-wide tabular-nums">
							EMBAUCHE LE {new Date(user.hire_date).toLocaleDateString("fr-FR")}
						</div>
						{/* Actions */}
						<div className="mt-4 flex gap-2">
							<button
								aria-label="Voir details"
								type="button"
								onClick={() => navigate(`/users/view/${user.id_user}`)}
								className="p-2.5 rounded-xl border border-sand bg-transparent text-ink-3 hover:text-ink hover:border-ink cursor-pointer transition-colors"
								title="Voir"
							>
								<Eye className="w-4 h-4" />
							</button>
							<button
								aria-label="Modifier"
								type="button"
								onClick={() => navigate(`/users/edit/${user.id_user}`)}
								className="p-2.5 rounded-xl border border-sand bg-transparent text-ink-3 hover:text-ink hover:border-ink cursor-pointer transition-colors"
								title="Modifier"
							>
								<Pencil className="w-4 h-4" />
							</button>
							<button
								aria-label="Supprimer"
								type="button"
								onClick={() => handleDelete(user.id_user)}
								className="p-2.5 rounded-xl border border-sand bg-transparent text-signal hover:bg-danger-soft cursor-pointer transition-colors"
								title="Supprimer"
							>
								<Trash2 className="w-4 h-4" />
							</button>
						</div>
					</div>
				))}
			</div>
		</div>
	);
};

export default UsersList;
