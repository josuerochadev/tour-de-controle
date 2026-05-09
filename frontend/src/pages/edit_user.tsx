import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useToast } from "../components/toast";
import userService from "../services/user_service";
import { ROLES, ROLE_LABELS, formatDateToISO } from "../constants";
import { updateUserSchema } from "../schemas/user_schema";
import type { UserFormData } from "../types/user";
import { inputClass, labelClass } from "../styles/form_classes";

const EditUser: React.FC = () => {
	const { id } = useParams();
	const navigate = useNavigate();
	const { showToast } = useToast();
	const [loading, setLoading] = useState(false);
	const [errors, setErrors] = useState<Record<string, string>>({});
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

	const fieldError = (field: string) =>
		errors[field] ? <p className="text-signal text-xs mt-1">{errors[field]}</p> : null;

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setErrors({});

		const result = updateUserSchema.safeParse(formData);
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
			await userService.update(Number(id), formData);
			showToast("Membre modifie avec succes", "success");
			navigate("/users");
		} catch {
			showToast("Erreur lors de la modification", "error");
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className="max-w-[720px] mx-auto">
			<div className="font-mono text-[11px] tracking-[2px] uppercase text-ink-4">// Equipage &middot; modification</div>
			<h1 className="mt-2 mb-8 font-display text-[40px] font-semibold leading-none tracking-tight uppercase">Modifier</h1>

			<form onSubmit={handleSubmit} className="bg-paper-soft border border-sand rounded-3xl p-8 space-y-5">
				<div>
					<label htmlFor="last_name" className={labelClass}>Nom</label>
					<input id="last_name" type="text" value={formData.last_name} onChange={(e) => setFormData({ ...formData, last_name: e.target.value })} className={inputClass} required />
					{fieldError("last_name")}
				</div>
				<div>
					<label htmlFor="first_name" className={labelClass}>Prenom</label>
					<input id="first_name" type="text" value={formData.first_name} onChange={(e) => setFormData({ ...formData, first_name: e.target.value })} className={inputClass} required />
					{fieldError("first_name")}
				</div>
				<div>
					<label htmlFor="email" className={labelClass}>Email</label>
					<input id="email" type="email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} className={inputClass} required />
					{fieldError("email")}
				</div>
				<div>
					<label htmlFor="postal_address" className={labelClass}>Adresse</label>
					<input id="postal_address" type="text" value={formData.postal_address} onChange={(e) => setFormData({ ...formData, postal_address: e.target.value })} className={inputClass} />
				</div>
				<div>
					<label htmlFor="phone_number" className={labelClass}>Telephone</label>
					<input id="phone_number" type="tel" value={formData.phone_number} onChange={(e) => setFormData({ ...formData, phone_number: e.target.value })} className={inputClass} />
					{fieldError("phone_number")}
				</div>
				<div>
					<label htmlFor="hire_date" className={labelClass}>Date d'embauche</label>
					<input id="hire_date" type="date" value={formData.hire_date} onChange={(e) => setFormData({ ...formData, hire_date: e.target.value })} className={inputClass} required />
					{fieldError("hire_date")}
				</div>
				<div>
					<label htmlFor="id_role" className={labelClass}>Role</label>
					<select id="id_role" value={formData.id_role} onChange={(e) => setFormData({ ...formData, id_role: Number.parseInt(e.target.value) })} className={inputClass} required>
						<option value="">Selectionner un role</option>
						{Object.entries(ROLE_LABELS).map(([id, label]) => (
							<option key={id} value={id}>{label}</option>
						))}
					</select>
				</div>
				<div className="flex justify-end gap-3 pt-4">
					<button type="button" onClick={() => navigate("/users")} className="px-5 py-3 border border-sand rounded-2xl font-display text-xs font-semibold tracking-wider uppercase cursor-pointer hover:bg-paper-2 transition-colors bg-transparent">
						Annuler
					</button>
					<button type="submit" disabled={loading} className="px-5 py-3 bg-ink text-paper rounded-2xl border-none font-display text-xs font-semibold tracking-wider uppercase cursor-pointer hover:bg-ink-2 transition-colors disabled:opacity-50">
						{loading ? "Enregistrement..." : "Sauvegarder"}
					</button>
				</div>
			</form>
		</div>
	);
};

export default EditUser;
