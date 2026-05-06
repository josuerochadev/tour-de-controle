// types/user.ts
export interface User {
    id_user: number;
    id_role: number;
    first_name: string;
    last_name: string;
    email: string;
    is_active: boolean;
    phone_number?: string;
    postal_address?: string;
    hire_date: Date;
  }