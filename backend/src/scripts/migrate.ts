/**
 * Migration + seed — called at backend startup.
 * Safe to re-run: uses CREATE TABLE IF NOT EXISTS and checks for existing data.
 */
import { Client } from "pg";

const SCHEMA = `
CREATE TABLE IF NOT EXISTS roles (
  id_role SERIAL PRIMARY KEY,
  role_name VARCHAR(255) NOT NULL UNIQUE
);

CREATE TABLE IF NOT EXISTS users (
  id_user SERIAL PRIMARY KEY,
  first_name VARCHAR(255) NOT NULL,
  last_name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  reset_token VARCHAR(255),
  postal_address VARCHAR(255),
  phone_number VARCHAR(20),
  hire_date DATE NOT NULL,
  is_active BOOLEAN DEFAULT TRUE,
  id_role INT NOT NULL REFERENCES roles(id_role)
);

CREATE TABLE IF NOT EXISTS payment_types (
  id_payment_type SERIAL PRIMARY KEY,
  payment_type_name VARCHAR(255) NOT NULL UNIQUE,
  is_active BOOLEAN DEFAULT TRUE
);

CREATE TABLE IF NOT EXISTS cash_registers (
  id_cash_register SERIAL PRIMARY KEY,
  date_opened TIMESTAMP NOT NULL DEFAULT NOW(),
  date_closed TIMESTAMP,
  has_gap BOOLEAN DEFAULT FALSE,
  physical_amount DECIMAL(10,2) NOT NULL,
  theoretical_amount DECIMAL(10,2) NOT NULL,
  status VARCHAR(50) NOT NULL CHECK (status IN ('OPEN', 'CLOSED')),
  opened_by INT NOT NULL REFERENCES users(id_user),
  closed_by INT REFERENCES users(id_user)
);

CREATE TABLE IF NOT EXISTS transactions (
  id_transaction SERIAL PRIMARY KEY,
  amount DECIMAL(10,2) NOT NULL CHECK (amount > 0),
  tip DECIMAL(10,2) DEFAULT 0 CHECK (tip >= 0),
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
  id_payment_type INT NOT NULL REFERENCES payment_types(id_payment_type),
  id_cash_register INT NOT NULL REFERENCES cash_registers(id_cash_register),
  created_by INT NOT NULL REFERENCES users(id_user)
);

CREATE TABLE IF NOT EXISTS action_logs (
  id_log SERIAL PRIMARY KEY,
  action_type VARCHAR(50) NOT NULL CHECK (action_type IN ('AUTH', 'CASH', 'TRANSACTION', 'USER', 'SYSTEM')),
  action VARCHAR(255) NOT NULL,
  details JSONB,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  id_user INT REFERENCES users(id_user)
);

CREATE INDEX IF NOT EXISTS idx_users_role ON users(id_role);
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_transactions_date ON transactions(created_at);
CREATE INDEX IF NOT EXISTS idx_transactions_payment_type ON transactions(id_payment_type);
CREATE INDEX IF NOT EXISTS idx_transactions_cash_register ON transactions(id_cash_register);
CREATE INDEX IF NOT EXISTS idx_transactions_created_by ON transactions(created_by);
CREATE INDEX IF NOT EXISTS idx_cash_registers_date ON cash_registers(date_opened);
CREATE INDEX IF NOT EXISTS idx_cash_registers_opened_by ON cash_registers(opened_by);
CREATE INDEX IF NOT EXISTS idx_cash_registers_closed_by ON cash_registers(closed_by);
CREATE INDEX IF NOT EXISTS idx_cash_registers_status ON cash_registers(status);
CREATE INDEX IF NOT EXISTS idx_action_logs_date ON action_logs(created_at);
CREATE INDEX IF NOT EXISTS idx_action_logs_user ON action_logs(id_user);
CREATE INDEX IF NOT EXISTS idx_action_logs_type ON action_logs(action_type);

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

DROP TRIGGER IF EXISTS update_transactions_updated_at ON transactions;
CREATE TRIGGER update_transactions_updated_at
  BEFORE UPDATE ON transactions
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
`;

// mot de passe: Password1
const SEED = `
INSERT INTO roles (role_name) VALUES
  ('Développeur'), ('Gérant'), ('Responsable'), ('Serveur');

INSERT INTO users (first_name, last_name, email, password, hire_date, is_active, id_role) VALUES
  ('Alice', 'Dupont', 'developpeur@tour-de-controle.com', '$2a$12$z5DPyrEvw1Mb8s54.8OTSOwQLclkGAO2HgEZ1PIK26jG.lVg4ujuq', '2023-01-15', TRUE, 1),
  ('Bob', 'Martin', 'gerant@tour-de-controle.com', '$2a$12$z5DPyrEvw1Mb8s54.8OTSOwQLclkGAO2HgEZ1PIK26jG.lVg4ujuq', '2023-02-20', TRUE, 2),
  ('Claire', 'Durand', 'responsable@tour-de-controle.com', '$2a$12$z5DPyrEvw1Mb8s54.8OTSOwQLclkGAO2HgEZ1PIK26jG.lVg4ujuq', '2023-03-10', TRUE, 3),
  ('David', 'Petit', 'serveur@tour-de-controle.com', '$2a$12$z5DPyrEvw1Mb8s54.8OTSOwQLclkGAO2HgEZ1PIK26jG.lVg4ujuq', '2023-04-05', TRUE, 4);

INSERT INTO payment_types (payment_type_name, is_active) VALUES
  ('Espèces', true), ('Carte Bancaire', true), ('Ticket Restaurant', true),
  ('Chèque', true), ('Chèque Vacances', true), ('American Express', true);

INSERT INTO cash_registers (date_opened, date_closed, has_gap, physical_amount, theoretical_amount, status, opened_by, closed_by) VALUES
  (NOW() - INTERVAL '2 days', NOW() - INTERVAL '1 day', false, 1000.00, 1000.00, 'CLOSED', 3, 3),
  (NOW() - INTERVAL '1 day', NOW() - INTERVAL '12 hours', true, 1500.00, 1520.50, 'CLOSED', 3, 3),
  (NOW(), NULL, false, 1000.00, 1000.00, 'OPEN', 3, NULL);

INSERT INTO transactions (amount, tip, created_at, id_payment_type, id_cash_register, created_by) VALUES
  (45.90, 5.00, NOW() - INTERVAL '2 days', 1, 1, 4),
  (78.50, 8.00, NOW() - INTERVAL '2 days', 2, 1, 4),
  (23.40, 2.50, NOW() - INTERVAL '1 day', 1, 2, 4),
  (156.70, 15.00, NOW() - INTERVAL '1 day', 3, 2, 4),
  (89.30, 10.00, NOW(), 1, 3, 4),
  (67.80, 7.00, NOW(), 2, 3, 4);

INSERT INTO action_logs (action_type, action, details, created_at, id_user) VALUES
  ('AUTH', 'LOGIN', '{"email": "developpeur@tour-de-controle.com"}', NOW() - INTERVAL '2 days', 1),
  ('CASH', 'OPEN', '{"id_cash_register": 1, "physical_amount": 1000}', NOW() - INTERVAL '2 days', 3),
  ('TRANSACTION', 'CREATE', '{"id_transaction": 1, "amount": 45.90}', NOW() - INTERVAL '2 days', 4),
  ('CASH', 'CLOSE', '{"id_cash_register": 1, "has_gap": false}', NOW() - INTERVAL '1 day', 3),
  ('AUTH', 'LOGOUT', NULL, NOW() - INTERVAL '12 hours', 3);
`;

export async function runMigrations(): Promise<void> {
  const client = process.env.DATABASE_URL
    ? new Client({
        connectionString: process.env.DATABASE_URL,
        ssl: { rejectUnauthorized: false },
      })
    : new Client({
        user: process.env.DB_USER,
        host: process.env.DB_HOST,
        database: process.env.DB_NAME,
        password: process.env.DB_PASS,
        port: Number(process.env.DB_PORT || "5432"),
      });

  await client.connect();
  console.log("[migrate] Running schema...");
  await client.query(SCHEMA);

  const { rows } = await client.query("SELECT COUNT(*) FROM roles");
  if (Number(rows[0].count) === 0) {
    console.log("[migrate] Seeding initial data...");
    await client.query(SEED);
  } else {
    console.log("[migrate] Data already present, skipping seed");
  }

  await client.end();
  console.log("[migrate] Done");
}
