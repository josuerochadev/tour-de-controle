import swaggerJsdoc from "swagger-jsdoc";

const options = {
	definition: {
		openapi: "3.0.0",
		info: {
			title: "Tour de Contrôle API",
			version: "1.0.0",
			description: "API de gestion des caisses et du personnel pour la restauration.",
		},
		servers: [
			{ url: "http://localhost:4000", description: "Développement" },
		],
		components: {
			securitySchemes: {
				cookieAuth: {
					type: "apiKey",
					in: "cookie",
					name: "authenticationToken",
				},
			},
			schemas: {
				User: {
					type: "object",
					properties: {
						id_user: { type: "integer" },
						first_name: { type: "string" },
						last_name: { type: "string" },
						email: { type: "string", format: "email" },
						postal_address: { type: "string" },
						phone_number: { type: "string" },
						hire_date: { type: "string", format: "date" },
						is_active: { type: "boolean" },
						id_role: { type: "integer", description: "1=Développeur, 2=Gérant, 3=Responsable, 4=Serveur" },
					},
				},
				UserCreate: {
					type: "object",
					required: ["first_name", "last_name", "email", "password", "hire_date", "id_role"],
					properties: {
						first_name: { type: "string", minLength: 2 },
						last_name: { type: "string", minLength: 2 },
						email: { type: "string", format: "email" },
						password: { type: "string", minLength: 8, description: "Min 8 chars, 1 majuscule, 1 chiffre" },
						postal_address: { type: "string" },
						phone_number: { type: "string", pattern: "^(\\+33|0)[1-9](\\d{2}){4}$" },
						hire_date: { type: "string", format: "date" },
						id_role: { type: "integer" },
					},
				},
				Transaction: {
					type: "object",
					properties: {
						id_transaction: { type: "integer" },
						amount: { type: "number", format: "decimal" },
						tip: { type: "number", format: "decimal" },
						created_at: { type: "string", format: "date-time" },
						updated_at: { type: "string", format: "date-time" },
						id_payment_type: { type: "integer" },
						id_cash_register: { type: "integer" },
						id_user: { type: "integer" },
					},
				},
				TransactionCreate: {
					type: "object",
					required: ["amount", "id_payment_type", "id_cash_register", "created_by"],
					properties: {
						amount: { type: "number", minimum: 0, exclusiveMinimum: true },
						tip: { type: "number", minimum: 0 },
						id_payment_type: { type: "integer" },
						id_cash_register: { type: "integer" },
						created_by: { type: "integer" },
					},
				},
				CashRegister: {
					type: "object",
					properties: {
						id_cash_register: { type: "integer" },
						date_opened: { type: "string", format: "date-time" },
						date_closed: { type: "string", format: "date-time", nullable: true },
						has_gap: { type: "boolean" },
						physical_amount: { type: "number", format: "decimal" },
						theoretical_amount: { type: "number", format: "decimal" },
						status: { type: "string", enum: ["OPEN", "CLOSED"] },
						opened_by: { type: "integer" },
						closed_by: { type: "integer", nullable: true },
					},
				},
				CashRegisterClose: {
					type: "object",
					required: ["funds"],
					properties: {
						funds: {
							type: "array",
							items: {
								type: "object",
								required: ["id_payment_type", "physical_amount"],
								properties: {
									id_payment_type: { type: "integer" },
									physical_amount: { type: "number" },
								},
							},
						},
					},
				},
				LoginRequest: {
					type: "object",
					required: ["email", "password"],
					properties: {
						email: { type: "string", format: "email" },
						password: { type: "string", minLength: 8 },
					},
				},
				PaginatedResponse: {
					type: "object",
					properties: {
						data: { type: "array", items: {} },
						total: { type: "integer" },
						page: { type: "integer" },
						limit: { type: "integer" },
					},
				},
			},
		},
		security: [{ cookieAuth: [] }],
	},
	apis: ["./src/routes/*.ts"],
};

const swaggerSpec = swaggerJsdoc(options);

export default swaggerSpec;
