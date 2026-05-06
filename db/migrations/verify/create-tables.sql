-- Verify tour_de_controle:create-tables on pg

BEGIN;

DO $$
BEGIN
   PERFORM 'roles'::regclass;
   PERFORM 'users'::regclass;
   PERFORM 'payment_types'::regclass;
   PERFORM 'cash_registers'::regclass;
   PERFORM 'transactions'::regclass;
   PERFORM 'action_logs'::regclass;

   IF NOT EXISTS (
       SELECT 1 FROM pg_trigger 
       WHERE tgname = 'update_transactions_updated_at'
   ) THEN
       RAISE EXCEPTION 'Trigger update_transactions_updated_at not found';
   END IF;

   IF NOT EXISTS (
       SELECT 1 FROM pg_proc 
       WHERE proname = 'update_updated_at_column'
   ) THEN
       RAISE EXCEPTION 'Function update_updated_at_column not found';
   END IF;

END $$;

ROLLBACK;
