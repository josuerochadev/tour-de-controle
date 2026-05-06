DO $$
BEGIN
  ASSERT (SELECT COUNT(*) FROM pg_indexes WHERE indexname = 'idx_users_role') = 1;
  ASSERT (SELECT COUNT(*) FROM pg_indexes WHERE indexname = 'idx_users_email') = 1;
  ASSERT (SELECT COUNT(*) FROM pg_indexes WHERE indexname = 'idx_transactions_payment_type') = 1;
  ASSERT (SELECT COUNT(*) FROM pg_indexes WHERE indexname = 'idx_transactions_cash_register') = 1;
  ASSERT (SELECT COUNT(*) FROM pg_indexes WHERE indexname = 'idx_transactions_created_by') = 1;
  ASSERT (SELECT COUNT(*) FROM pg_indexes WHERE indexname = 'idx_cash_registers_opened_by') = 1;
  ASSERT (SELECT COUNT(*) FROM pg_indexes WHERE indexname = 'idx_cash_registers_closed_by') = 1;
END $$;
