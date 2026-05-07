/** Mirrored from backend/src/config/constants.ts — keep in sync */
export const ROLES = {
	DEVELOPER: 1,
	MANAGER: 2,
	SUPERVISOR: 3,
	SERVER: 4,
} as const;

export const ROLE_LABELS: Record<number, string> = {
	[ROLES.DEVELOPER]: "Développeur",
	[ROLES.MANAGER]: "Gérant",
	[ROLES.SUPERVISOR]: "Responsable",
	[ROLES.SERVER]: "Serveur",
};

export const ADMIN_ROLES: readonly number[] = [ROLES.DEVELOPER, ROLES.MANAGER];

export const PAYMENT_TYPE_FALLBACK: Record<number, string> = {
	1: "Espèces",
	2: "CB",
	3: "Ticket Restaurant",
	4: "Chèque",
	5: "Chèques Vacances",
	6: "American Express",
};

export const PAYMENT_TYPES = {
	CASH: 1,
	CB: 2,
	TICKET_RESTAURANT: 3,
	CHEQUE: 4,
	CHEQUES_VACANCES: 5,
	AMERICAN_EXPRESS: 6,
} as const;

export const TOAST_DURATION_MS = 4000;
export const DASHBOARD_RECENT_LIMIT = 10;

export const formatTodayDate = (): string =>
	new Date().toISOString().split("T")[0];

export const formatDateToISO = (date: string | Date): string =>
	new Date(date).toISOString().split("T")[0];
