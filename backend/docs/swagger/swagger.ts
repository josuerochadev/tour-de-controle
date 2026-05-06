import swaggerJsdoc from "swagger-jsdoc";

const options = {
	definition: {
		openapi: "3.0.0",
		info: {
			title: "API Documentation",
			version: "1.0.0",
			description:
				"Documentation de l'API pour gérer les transactions, utilisateurs, caisses, et authentification.",
		},
		servers: [
			{
				url: "http://localhost:4000",
				description: "Serveur de développement",
			},
		],
		components: {
			securitySchemes: {
				bearerAuth: {
					type: "http",
					scheme: "bearer",
					bearerFormat: "JWT",
				},
			},
			schemas: {
				// Schéma pour les utilisateurs
				User: {
					type: "object",
					properties: {
						id_user: {
							type: "integer",
							description: "ID unique de l'utilisateur",
						},
						name: {
							type: "string",
							description: "Nom de l'utilisateur",
						},
						email: {
							type: "string",
							description: "Adresse email de l'utilisateur",
						},
						role: {
							type: "integer",
							description: "Rôle de l'utilisateur",
						},
						created_at: {
							type: "string",
							format: "date-time",
							description: "Date de création de l'utilisateur",
						},
						updated_at: {
							type: "string",
							format: "date-time",
							description: "Date de mise à jour de l'utilisateur",
						},
					},
				},
				UserCreate: {
					type: "object",
					required: ["name", "email", "password"],
					properties: {
						name: {
							type: "string",
							description: "Nom de l'utilisateur",
						},
						email: {
							type: "string",
							description: "Adresse email",
						},
						password: {
							type: "string",
							description: "Mot de passe",
						},
					},
				},
				UserUpdate: {
					type: "object",
					properties: {
						name: {
							type: "string",
							description: "Nom mis à jour de l'utilisateur",
						},
						email: {
							type: "string",
							description: "Email mis à jour de l'utilisateur",
						},
					},
				},

				// Schéma pour les transactions
				Transaction: {
					type: "object",
					properties: {
						id_transaction: {
							type: "integer",
							description: "ID unique de la transaction",
						},
						amount: {
							type: "number",
							description: "Montant de la transaction",
						},
						tip: {
							type: "number",
							description: "Pourboire facultatif",
						},
						created_at: {
							type: "string",
							format: "date-time",
							description: "Date de création de la transaction",
						},
						updated_at: {
							type: "string",
							format: "date-time",
							description: "Date de mise à jour de la transaction",
						},
						id_payment_type: {
							type: "integer",
							description: "ID du type de paiement",
						},
						id_cash_register: {
							type: "integer",
							description: "ID de la caisse associée",
						},
						id_user: {
							type: "integer",
							description: "ID de l'utilisateur associé",
						},
					},
				},
				TransactionCreate: {
					type: "object",
					required: [
						"amount",
						"id_payment_type",
						"id_cash_register",
						"id_user",
					],
					properties: {
						amount: {
							type: "number",
							description: "Montant de la transaction",
						},
						tip: {
							type: "number",
							description: "Pourboire facultatif",
						},
						id_payment_type: {
							type: "integer",
							description: "ID du type de paiement",
						},
						id_cash_register: {
							type: "integer",
							description: "ID de la caisse associée",
						},
						id_user: {
							type: "integer",
							description: "ID de l'utilisateur associé",
						},
					},
				},
				TransactionUpdate: {
					type: "object",
					properties: {
						amount: {
							type: "number",
							description: "Montant mis à jour de la transaction",
						},
						tip: {
							type: "number",
							description: "Pourboire mis à jour",
						},
					},
				},

				// Schéma pour les caisses (cash registers)
				CashRegister: {
					type: "object",
					properties: {
						id_cash_register: {
							type: "integer",
							description: "ID unique de la caisse",
						},
						opening_balance: {
							type: "number",
							description: "Solde initial de la caisse",
						},
						closing_balance: {
							type: "number",
							description: "Solde final de la caisse (si fermé)",
						},
						status: {
							type: "string",
							enum: ["open", "closed"],
							description: "Statut de la caisse",
						},
						created_at: {
							type: "string",
							format: "date-time",
							description: "Date d'ouverture de la caisse",
						},
						updated_at: {
							type: "string",
							format: "date-time",
							description: "Date de mise à jour de la caisse",
						},
					},
				},
				CashRegisterCreate: {
					type: "object",
					required: ["opening_balance"],
					properties: {
						opening_balance: {
							type: "number",
							description: "Solde initial de la caisse",
						},
					},
				},
				CashRegisterClose: {
					type: "object",
					required: ["closing_balance"],
					properties: {
						closing_balance: {
							type: "number",
							description: "Solde final de la caisse",
						},
					},
				},
			},
		},
	},
	apis: ["./src/routes/*.ts"],
};

const swaggerSpec = swaggerJsdoc(options);

export default swaggerSpec;
