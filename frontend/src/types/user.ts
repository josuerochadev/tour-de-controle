export interface User {
	id_user: number;
	id_role: number;
	first_name: string;
	last_name: string;
	email: string;
	is_active: boolean;
	phone_number?: string;
	postal_address?: string;
	hire_date: string;
	role_name?: string;
}

export interface AuthUser {
	id: number;
	first_name: string;
	last_name: string;
	email: string;
	role: number;
}

export interface UserFormData {
	first_name: string;
	last_name: string;
	email: string;
	postal_address: string;
	phone_number: string;
	hire_date: string;
	id_role: number;
}

export interface CreateUserFormData extends UserFormData {
	password: string;
}
