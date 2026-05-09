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

-- Indexes
CREATE INDEX IF NOT EXISTS idx_transactions_date ON transactions(created_at);
CREATE INDEX IF NOT EXISTS idx_cash_registers_date ON cash_registers(date_opened);
CREATE INDEX IF NOT EXISTS idx_action_logs_date ON action_logs(created_at);

-- Triggers pour updated_at
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

COMMIT;