# Tour-De-Controle

![Logo Tour De Controle](./images/LogoLaTourDeControle.svg)

**La Tour de Contrôle** est une application web offrant une solution complète pour le contrôle des caisses et la gestion du personnel dans le secteur de la restauration. Elle permet aux gérants de restaurants d'optimiser leurs opérations, de réduire les erreurs et d'améliorer leur efficacité. L'application est conçue pour être simple à utiliser, fiable et sécurisée.

---

## Structure du projet

```
tour-de-controle
│
├── backend          # API et logique serveur
├── conception       # Diagrammes UML, wireframes et documentation
├── db               # Gestion de la base de données (Sqitch, scripts SQL)
├── frontend         # Application frontend (React + Vite)
├── images           # Ressources graphiques du projet
├── .env             # Variables d'environnement (à configurer)
├── .gitignore       # Fichiers à exclure de Git
├── docker-compose.yml # Configuration Docker pour une exécution simplifiée
└── README.md        # Documentation du projet
```

---

## Prérequis

Avant de commencer, assurez-vous que les outils suivants sont installés sur votre machine :

- [Node.js](https://nodejs.org/) (version 16+ recommandée)
- [PostgreSQL](https://www.postgresql.org/) (version 14 ou supérieure)
- [Sqitch](https://sqitch.org/) (pour la gestion des migrations)
- [Git](https://git-scm.com/) (pour cloner le projet)

---

## Installation

### 1. Cloner le dépôt
Clonez ce dépôt sur votre machine locale :
```bash
git clone https://github.com/votre-compte/tour-de-controle.git
cd tour-de-controle
```

### 2. Configurer les variables d'environnement
Copiez le fichier `.env.example` fourni à la racine du projet et renommez-le en `.env`. Personnalisez les valeurs en fonction de votre environnement.
```env
# Variables pour PostgreSQL
POSTGRES_USER=admin
POSTGRES_PASSWORD=admin123
POSTGRES_DB=tour_de_controle
DB_PORT=5432
DATABASE_URL=postgresql://admin:admin123@localhost:5432/tour_de_controle

# Variables pour le client
CLIENT_URL=http://localhost:3000
```

---

### 3. Préparer la base de données

#### Étape 1 : Créer le rôle utilisateur et la base
Assurez-vous que PostgreSQL est installé et en cours d'exécution. Ensuite, créez le rôle et la base de données :
```bash
psql -U postgres -h localhost
```
Dans la console PostgreSQL, exécutez les commandes suivantes :
```sql
CREATE ROLE admin WITH LOGIN PASSWORD 'admin123';
ALTER ROLE admin CREATEDB;
CREATE DATABASE tour_de_controle OWNER admin;
\q
```

#### Étape 2 : Appliquer les migrations
Appliquez les migrations Sqitch pour créer les tables :
```bash
cd db
sqitch deploy
```

#### Étape 3 : Ajouter les données initiales
Exécutez le script SQL de seeding pour insérer les données de base :
```bash
psql -U admin -h localhost -d tour_de_controle -f db/data/seeding.sql
```

---

### 4. Installer et lancer le backend
Dans le dossier `backend`, installez les dépendances et lancez le serveur :
```bash
cd backend
npm install
npm run dev
```
Le backend sera accessible à l’adresse `http://localhost:4000`.

---

### 5. Installer et lancer le frontend
Dans le dossier `frontend`, installez les dépendances et démarrez le serveur de développement :
```bash
cd ../frontend
npm install
npm run dev
```
Le frontend sera accessible à l’adresse `http://localhost:3000`.

---

## Tests

Pour exécuter les tests du backend :
```bash
cd backend
npm run test
```

---

## Fonctionnalités principales

- **Gestion des caisses** : Suivi précis des transactions et des montants collectés.
- **Gestion du personnel** : Organisation des plannings, suivi des performances, etc.
- **Rapports détaillés** : Génération de rapports pour une meilleure prise de décision.

---