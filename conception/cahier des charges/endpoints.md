# 6. Endpoints de l’API

Cette section détaille les endpoints de l’API backend, en fournissant une liste complète des routes prévues, leurs méthodes HTTP, leurs descriptions, les paramètres requis et les réponses attendues. Cette documentation facilitera le développement, les tests et la maintenance de l’API.

## 6.1 Authentification

### 6.1.1 Connexion d’un utilisateur

- **Méthode HTTP:** POST
- **URL:** /api/auth/login
- **Description:** Authentifie un utilisateur avec son email et mot de passe, et renvoie un jeton JWT.
- **Corps de la requête:**

    ```json
    {
        "email": "string",
        "password": "string"
    }
    ```

- **Réponse:**
    - **Succès (200 OK):**

        ```json
        {
            "token": "string",
            "user": {
                "id_user": "int",
                "first_name": "string",
                "last_name": "string",
                "email": "string",
                "id_role": "int",
                "role_name": "string"
            }
        }
        ```

    - **Échec (401 Unauthorized):**

        ```json
        {
            "message": "Email ou mot de passe incorrect."
        }
        ```

### 6.1.2 Déconnexion d’un utilisateur

- **Méthode HTTP:** POST
- **URL:** /api/auth/logout
- **Description:** Invalide le jeton JWT de l’utilisateur (si une gestion côté serveur des jetons invalidés est implémentée).
- **En-têtes requis:**
    - Authorization: Bearer <token>
- **Réponse:**
    - **Succès (200 OK):**

        ```json
        {
            "message": "Déconnexion réussie."
        }
        ```

## 6.2 Utilisateurs

### 6.2.1 Récupérer la liste des utilisateurs

- **Méthode HTTP:** GET
- **URL:** /api/users
- **Description:** Récupère la liste de tous les utilisateurs.
- **En-têtes requis:**
    - Authorization: Bearer <token> (Rôle: Gérant)
- **Réponse:**
    - **Succès (200 OK):**

        ```json
        [
            {
                "id_user": "int",
                "first_name": "string",
                "last_name": "string",
                "email": "string",
                "id_role": "int",
                "role_name": "string",
                "is_active": "boolean"
            },
            ...
        ]
        ```

### 6.2.2 Créer un nouvel utilisateur

- **Méthode HTTP:** POST
- **URL:** /api/users
- **Description:** Crée un nouvel utilisateur avec les informations fournies.
- **En-têtes requis:**
    - Authorization: Bearer <token> (Rôle: Gérant)
- **Corps de la requête:**

    ```json
    {
        "first_name": "string",
        "last_name": "string",
        "email": "string",
        "password": "string",
        "id_role": "int",
        "address": "string",
        "phone_number": "string",
        "hire_date": "date",
        "description": "string"
    }
    ```

- **Réponse:**
    - **Succès (201 Created):**

        ```json
        {
            "message": "Utilisateur créé avec succès.",
            "user": {
                "id_user": "int",
                "first_name": "string",
                "last_name": "string",
                "email": "string",
                "id_role": "int",
                "role_name": "string"
            }
        }
        ```

    - **Échec (400 Bad Request):**

        ```json
        {
            "message": "Erreur de validation des données."
        }
        ```

### 6.2.3 Récupérer un utilisateur par ID

- **Méthode HTTP:** GET
- **URL:** /api/users/{id_user}
- **Description:** Récupère les informations d’un utilisateur spécifique.
- **En-têtes requis:**
    - Authorization: Bearer <token> (Rôle: Gérant)
- **Paramètres de chemin:**
    - id_user: ID de l’utilisateur à récupérer.
- **Réponse:**
    - **Succès (200 OK):**

        ```json
        {
            "id_user": "int",
            "first_name": "string",
            "last_name": "string",
            "email": "string",
            "id_role": "int",
            "role_name": "string",
            "address": "string",
            "phone_number": "string",
            "hire_date": "date",
            "is_active": "boolean",
            "description": "string"
        }
        ```

    - **Échec (404 Not Found):**

        ```json
        {
            "message": "Utilisateur non trouvé."
        }
        ```

### 6.2.4 Modifier un utilisateur

- **Méthode HTTP:** PUT
- **URL:** /api/users/{id_user}
- **Description:** Modifie les informations d’un utilisateur existant.
- **En-têtes requis:**
    - Authorization: Bearer <token> (Rôle: Gérant)
- **Paramètres de chemin:**
    - id_user: ID de l’utilisateur à modifier.
- **Corps de la requête:**

    ```json
    {
        "first_name": "string",
        "last_name": "string",
        "email": "string",
        "id_role": "int",
        "address": "string",
        "phone_number": "string",
        "hire_date": "date",
        "is_active": "boolean",
        "description": "string"
    }
    ```

- **Réponse:**
    - **Succès (200 OK):**

        ```json
        {
            "message": "Utilisateur mis à jour avec succès.",
            "user": {
                "id_user": "int",
                "first_name": "string",
                "last_name": "string",
                "email": "string",
                "id_role": "int",
                "role_name": "string"
            }
        }
        ```

    - **Échec (400 Bad Request):**

        ```json
        {
            "message": "Erreur de validation des données."
        }
        ```

### 6.2.5 Supprimer un utilisateur

- **Méthode HTTP:** DELETE
- **URL:** /api/users/{id_user}
- **Description:** Supprime un utilisateur existant.
- **En-têtes requis:**
    - Authorization: Bearer <token> (Rôle: Gérant)
- **Paramètres de chemin:**
    - id_user: ID de l’utilisateur à supprimer.
- **Réponse:**
    - **Succès (200 OK):**

        ```json
        {
            "message": "Utilisateur supprimé avec succès."
        }
        ```

    - **Échec (404 Not Found):**

        ```json
        {
            "message": "Utilisateur non trouvé."
        }
        ```

## 6.3 Transactions

### 6.3.1 Récupérer la liste des transactions

- **Méthode HTTP:** GET
- **URL:** /api/transactions
- **Description:** Récupère la liste des transactions, avec possibilité de filtrage.
- **En-têtes requis:**
    - Authorization: Bearer <token> (Rôles: Gérant, Responsable, Serveur)
- **Paramètres de requête (optionnels):**
    - date_from: Date de début (YYYY-MM-DD)
    - date_to: Date de fin (YYYY-MM-DD)
    - payment_type: ID du type de paiement
    - amount_min: Montant minimum
    - amount_max: Montant maximum
    - user_id: ID de l’utilisateur ayant effectué la transaction
- **Réponse:**
    - **Succès (200 OK):**

        ```json
        [
            {
                "id_transaction": "int",
                "amount": "decimal",
                "tip": "decimal",
                "date_transaction": "datetime",
                "id_payment_type": "int",
                "payment_type_name": "string",
                "id_cash_register": "int",
                "id_user": "int",
                "user_name": "string"
            },
            ...
        ]
        ```

### 6.3.2 Enregistrer une nouvelle transaction

- **Méthode HTTP:** POST
- **URL:** /api/transactions
- **Description:** Enregistre une nouvelle transaction.
- **En-têtes requis:**
    - Authorization: Bearer <token> (Rôles: Responsable, Serveur)
- **Corps de la requête:**

    ```json
    {
        "amount": "decimal",
        "tip": "decimal",
        "id_payment_type": "int",
        "description": "string"
    }
    ```

- **Réponse:**
    - **Succès (201 Created):**

        ```json
        {
            "message": "Transaction enregistrée avec succès.",
            "transaction": {
                "id_transaction": "int",
                "amount": "decimal",
                "tip": "decimal",
                "date_transaction": "datetime",
                "id_payment_type": "int",
                "id_cash_register": "int",
                "id_user": "int"
            }
        }
        ```

    - **Échec (400 Bad Request):**

        ```json
        {
            "message": "Erreur de validation des données."
        }
        ```

### 6.3.3 Récupérer une transaction par ID

- **Méthode HTTP:** GET
- **URL:** /api/transactions/{id_transaction}
- **Description:** Récupère les détails d’une transaction spécifique.
- **En-têtes requis:**
    - Authorization: Bearer <token> (Rôles: Gérant, Responsable, Serveur)
- **Paramètres de chemin:**
    - id_transaction: ID de la transaction à récupérer.
- **Réponse:**
    - **Succès (200 OK):**

        ```json
        {
            "id_transaction": "int",
            "amount": "decimal",
            "tip": "decimal",
            "date_transaction": "datetime",
            "id_payment_type": "int",
            "payment_type_name": "string",
            "id_cash_register": "int",
            "id_user": "int",
            "user_name": "string",
            "description": "string"
        }
        ```

    - **Échec (404 Not Found):**

        ```json
        {
            "message": "Transaction non trouvée."
        }
        ```

## 6.4 Gestion de la Caisse

### 6.4.1 Ouvrir une nouvelle caisse

- **Méthode HTTP:** POST
- **URL:** /api/cash-registers
- **Description:** Ouvre une nouvelle caisse pour le restaurant courant.
- **En-têtes requis:**
    - Authorization: Bearer <token> (Rôle: Responsable)
- **Corps de la requête:**

    ```json
    {
        "description": "string"
    }
    ```

- **Réponse:**
    - **Succès (201 Created):**

        ```json
        {
            "message": "Caisse ouverte avec succès.",
            "cash_register": {
                "id_cash_register": "int",
                "date_opened": "datetime",
                "id_restaurant": "int",
                "description": "string"
            }
        }
        ```

### 6.4.2 Clôturer une caisse

- **Méthode HTTP:** PUT
- **URL:** /api/cash-registers/{id_cash_register}/close
- **Description:** Clôture la caisse spécifiée, en saisissant les fonds physiques et en comparant avec les transactions enregistrées.
- **En-têtes requis:**
    - Authorization: Bearer <token> (Rôle: Responsable)
- **Paramètres de chemin:**
    - id_cash_register: ID de la caisse à clôturer.
- **Corps de la requête:**

    ```json
    {
        "funds": [
            {
                "id_payment_type": "int",
                "physical_amount": "decimal"
            },
            ...
        ],
        "description": "string"
    }
    ```

- **Réponse:**
    - **Succès (200 OK):**

        ```json
        {
            "message": "Caisse clôturée avec succès.",
            "cash_register": {
                "id_cash_register": "int",
                "date_closed": "datetime",
                "justification_of_gap": "string",
                "id_restaurant": "int",
                "description": "string"
            },
            "discrepancies": [
                {
                    "id_payment_type": "int",
                    "payment_type_name": "string",
                    "theoretical_amount": "decimal",
                    "physical_amount": "decimal",
                    "difference": "decimal"
                },
                ...
            ]
        }
        ```

    - **Échec (400 Bad Request):**

        ```json
        {
            "message": "Erreur de validation des données."
        }
        ```

### 6.4.3 Récupérer l’état actuel de la caisse

- **Méthode HTTP:** GET
- **URL:** /api/cash-registers/current
- **Description:** Récupère les informations de la caisse actuellement ouverte pour le restaurant courant.
- **En-têtes requis:**
    - Authorization: Bearer <token> (Rôle: Responsable)
- **Réponse:**
    - **Succès (200 OK):**

        ```json
        {
            "id_cash_register": "int",
            "date_opened": "datetime",
            "transactions": [...],
            "funds": [...],
            "description": "string"
        }
        ```

    - **Échec (404 Not Found):**

        ```json
        {
            "message": "Aucune caisse ouverte trouvée."
        }
        ```

## 6.5 Types de Paiement

### 6.5.1 Récupérer la liste des types de paiement

- **Méthode HTTP:** GET
- **URL:** /api/payment-types
- **Description:** Récupère la liste des types de paiement disponibles.
- **En-têtes requis:**
    - Authorization: Bearer <token> (Utilisateurs connectés)
- **Réponse:**
    - **Succès (200 OK):**

        ```json
        [
            {
                "id_payment_type": "int",
                "name": "string",
                "description": "string"
            },
            ...
        ]
        ```

## 6.6 Journaux d’Actions

### 6.6.1 Récupérer les journaux d’actions

- **Méthode HTTP:** GET
- **URL:** /api/action-logs
- **Description:** Récupère les journaux des actions effectuées par les utilisateurs, avec possibilité de filtrage.
- **En-têtes requis:**
    - Authorization: Bearer <token> (Rôle: Gérant)
- **Paramètres de requête (optionnels):**
    - user_id: ID de l’utilisateur
    - date_from: Date de début
    - date_to: Date de fin
    - action: Type d’action
- **Réponse:**
    - **Succès (200 OK):**

        ```json
        [
            {
                "id_log": "int",
                "action": "string",
                "date": "datetime",
                "details": "string",
                "id_user": "int",
                "user_name": "string",
                "description": "string"
            },
            ...
        ]
        ```

## 6.7 Support Technique

### 6.7.1 Envoyer un message au support

- **Méthode HTTP:** POST
- **URL:** /api/support
- **Description:** Envoie un message au support technique.
- **En-têtes requis:**
    - Authorization: Bearer <token> (Rôles: Responsable, Serveur)
- **Corps de la requête:**

    ```json
    {
        "subject": "string",
        "message": "string"
    }
    ```

- **Réponse:**
    - **Succès (200 OK):**

        ```json
        {
            "message": "Votre message a été envoyé au support technique."
        }
        ```

    - **Échec (400 Bad Request):**

        ```json
        {
            "message": "Erreur de validation des données."
        }
        ```

## 6.8 Documentation et Aide

### 6.8.1 Récupérer la documentation intégrée

- **Méthode HTTP:** GET
- **URL:** /api/help
- **Description:** Récupère le contenu de la documentation intégrée.
- **En-têtes requis:**
    - Authorization: Bearer <token> (Utilisateurs connectés)
- **Réponse:**
    - **Succès (200 OK):**

        ```json
        {
            "content": "string"  // Contenu en format HTML ou Markdown
        }
        ```

## 6.9 Exemples de Codes d’Erreur Communs

- **401 Unauthorized:** Jeton JWT manquant ou invalide.

    ```json
    {
        "message": "Authentification requise."
    }
    ```

- **403 Forbidden:** L’utilisateur n’a pas les permissions nécessaires.

    ```json
    {
        "message": "Accès refusé."
    }
    ```

- **404 Not Found:** Ressource non trouvée.

    ```json
    {
        "message": "Ressource non trouvée."
    }
    ```

- **500 Internal Server Error:** Erreur interne du serveur.

    ```json
    {
        "message": "Une erreur interne est survenue."
    }
    ```

**Note:** Tous les endpoints protégés nécessitent un jeton JWT valide dans l’en-tête Authorization. Les rôles des utilisateurs déterminent les permissions d’accès aux différents endpoints.

**Résumé:**

Cette section fournit une liste détaillée des endpoints de l’API, alignée avec les besoins fonctionnels de l’application tels que décrits dans les user stories et l’architecture proposée. Chaque endpoint est documenté avec sa méthode HTTP, son URL, sa description, les paramètres requis, le corps de la requête et les réponses attendues, facilitant ainsi le développement et la maintenance de l’application.