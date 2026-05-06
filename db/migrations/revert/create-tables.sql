-- Revert tour_de_controle:create-tables from pg

BEGIN;

-- Suppression des triggers et fonctions
DROP TRIGGER IF EXISTS update_transactions_updated_at ON transactions;
DROP FUNCTION IF EXISTS update_updated_at_column();

-- Suppression des index
DROP INDEX IF EXISTS idx_transactions_date;
DROP INDEX IF EXISTS idx_cash_registers_date;
DROP INDEX IF EXISTS idx_action_logs_date;

-- Suppression des tables dans l'ordre des dépendances
DROP TABLE IF EXISTS action_logs CASCADE;
DROP TABLE IF EXISTS transactions CASCADE;
DROP TABLE IF EXISTS cash_registers CASCADE;
DROP TABLE IF EXISTS payment_types CASCADE;
DROP TABLE IF EXISTS users CASCADE;
DROP TABLE IF EXISTS roles CASCADE;

COMMIT;