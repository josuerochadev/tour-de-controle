BEGIN;

-- 1. Roles
INSERT INTO roles (role_name) VALUES
  ('Développeur'),
  ('Gérant'),
  ('Responsable'), 
  ('Serveur');

-- 2. Users
INSERT INTO users (first_name, last_name, email, password, reset_token, postal_address, phone_number, hire_date, is_active, id_role) VALUES
  ('Alice', 'Dupont', 'developpeur@tour-de-controle.com', '$2a$12$XNl/PtlMv9u8WkqBJeWWXuvGcaKyhNLLYRu5nVEsm4ngM0ZCr5Ftq', NULL, '123 Rue de Paris', '0612345678', '2023-01-15', TRUE, 1),
  ('Bob', 'Martin', 'gerant@tour-de-controle.com', '$2a$12$zbPRlsct66IeqMBI28M4Mu5ruP9yd02Wz1VoUZjTfXSw.EF4HNqGG', NULL, '456 Rue de Lyon', '0612345679', '2023-02-20', TRUE, 2),
  ('Claire', 'Durand', 'responsable@tour-de-controle.com', '$2a$12$a0oJU/SSesnasdDxttYvJupXo4UFxyTG1cw9/bcYMw0KCq5MRISFe', NULL, '789 Rue de Marseille', '0612345680', '2023-03-10', TRUE, 3),
  ('David', 'Petit', 'serveur@tour-de-controle.com', '$2a$12$thcr2wfwlB2BIIxHHmuEUedMwv9OW70BavYakup/Xel4OUg2JGuIG', NULL, '101 Rue de Bordeaux', '0612345681', '2023-04-05', TRUE, 4);

-- 3. Types de paiement
INSERT INTO payment_types (payment_type_name, is_active) VALUES
  ('Espèces', true),
  ('Carte Bancaire', true),
  ('Ticket Restaurant', true),
  ('Chèque', true),
  ('Chèque Vacances', true),
  ('American Express', true);

-- 4. Caisses
INSERT INTO cash_registers (date_opened, date_closed, has_gap, physical_amount, theoretical_amount, status, opened_by, closed_by) VALUES
  (NOW() - INTERVAL '2 days', NOW() - INTERVAL '1 day', false, 1000.00, 1000.00, 'CLOSED', 3, 3),
  (NOW() - INTERVAL '1 day', NOW() - INTERVAL '12 hours', true, 1500.00, 1520.50, 'CLOSED', 3, 3),
  (NOW(), NULL, false, 1000.00, 1000.00, 'OPEN', 3, NULL);

-- 5. Transactions
INSERT INTO transactions (amount, tip, created_at, id_payment_type, id_cash_register, created_by) VALUES
  (45.90, 5.00, NOW() - INTERVAL '2 days', 1, 1, 4),
  (78.50, 8.00, NOW() - INTERVAL '2 days', 2, 1, 4),
  (23.40, 2.50, NOW() - INTERVAL '1 day', 1, 2, 4),
  (156.70, 15.00, NOW() - INTERVAL '1 day', 3, 2, 4),
  (89.30, 10.00, NOW(), 1, 3, 4),
  (67.80, 7.00, NOW(), 2, 3, 4);

-- 6. Logs 
INSERT INTO action_logs (action_type, action, details, created_at, id_user) VALUES
  ('AUTH', 'Connexion Utilisateur', '{"ip": "192.168.1.1", "navigateur": "Chrome"}', NOW() - INTERVAL '2 days', 1),
  ('CASH', 'Ouverture Caisse', '{"montant": 1000.00, "id_caisse": 1}', NOW() - INTERVAL '2 days', 3),
  ('TRANSACTION', 'Nouvelle Transaction', '{"montant": 45.90, "paiement": "Espèces"}', NOW() - INTERVAL '2 days', 4),
  ('SYSTEM', 'Sauvegarde Terminée', '{"statut": "succès"}', NOW() - INTERVAL '1 day', 1),
  ('USER', 'Modification Mot de Passe', '{"id_utilisateur": 2}', NOW(), 2);

COMMIT;