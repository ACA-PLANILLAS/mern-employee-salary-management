USE db_penggajian3;

ALTER TABLE parameters
  MODIFY COLUMN value VARCHAR(255) NULL,
  ADD COLUMN value_type ENUM('INT', 'DOUBLE', 'STRING') NOT NULL
    DEFAULT 'INT';

TRUNCATE TABLE parameters;

INSERT INTO parameters (id, name, value, value_type, type) VALUES
  (1, 'Horas semanales',                   '44',              'INT',    'HWEK'),
  (2, 'Dias semanales',                    '6',               'INT',    'DWEK'),
  (3, 'Pagos en mes',                      '2',               'INT',    'PMON'),
  (4, 'DUI/NIT del Empleador',             '0614200595',      'STRING', 'DUIN'),
  (5, 'Número patronal ISSS',              '12345678',        'STRING', 'NPIS'),
  (6, 'Correlativo Centro de Trabajo ISSS','876543',          'INT',    'CCTS'),
  (7, 'Nombre de la empresa',              'AdventureWorks S.A.','STRING','COMP'),
  (8, 'Ubicación de la empresa',           'Acajutla, Sonsonate','STRING','ADCO');


TRUNCATE potongan_gaji;

-- 1) Remuneraciones semanales (payment_frequency = 1)
INSERT INTO potongan_gaji
  (potongan, jml_potongan, `from`, `until`, value_d, type, createdAt, updatedAt, payment_frequency, deduction_group)
VALUES
  ('I Tramo',   0.000,  0.01,  137.50, 0.00, 'DIN', NOW(), NOW(), 4, 'Remuneraciones semanales'),
  ('II Tramo', 0.1000, 137.51, 223.81, 4.42, 'DIN', NOW(), NOW(), 4, 'Remuneraciones semanales'),
  ('III Tramo',0.2000, 223.82, 509.52,15.00, 'DIN', NOW(), NOW(), 4, 'Remuneraciones semanales'),
  ('IV Tramo', 0.3000, 509.53,  -1,  72.14, 'DIN', NOW(), NOW(), 4, 'Remuneraciones semanales');

-- 2) Remuneraciones quincenales (payment_frequency = 2)
INSERT INTO potongan_gaji
  (potongan, jml_potongan, `from`, `until`, value_d, type, createdAt, updatedAt, payment_frequency, deduction_group)
VALUES
  ('I Tramo',   0.000,   0.01,  275.00, 0.00,  'DIN', NOW(), NOW(), 2, 'Remuneraciones quincenales'),
  ('II Tramo', 0.1000, 275.01, 447.62, 8.83,  'DIN', NOW(), NOW(), 2, 'Remuneraciones quincenales'),
  ('III Tramo',0.2000, 447.63,1019.05,30.00, 'DIN', NOW(), NOW(), 2, 'Remuneraciones quincenales'),
  ('IV Tramo', 0.3000,1019.06,   -1,144.28, 'DIN', NOW(), NOW(), 2, 'Remuneraciones quincenales');

-- 3) Remuneraciones mensuales (payment_frequency = 4)
INSERT INTO potongan_gaji
  (potongan, jml_potongan, `from`, `until`, value_d, type, createdAt, updatedAt, payment_frequency, deduction_group)
VALUES
  ('I Tramo',   0.000,    0.01,  550.00,   0.00, 'DIN', NOW(), NOW(), 1, 'Remuneraciones mensuales'),
  ('II Tramo', 0.1000, 550.01,  895.24,  17.67, 'DIN', NOW(), NOW(), 1, 'Remuneraciones mensuales'),
  ('III Tramo',0.2000, 895.25, 2038.10,  60.00, 'DIN', NOW(), NOW(), 1, 'Remuneraciones mensuales'),
  ('IV Tramo', 0.3000,2038.11,    -1, 288.57, 'DIN', NOW(), NOW(), 1, 'Remuneraciones mensuales');

  -- Aportaciones legales (pago mensual)
INSERT INTO potongan_gaji
  (potongan, jml_potongan, type, createdAt, updatedAt, payment_frequency, deduction_group)
VALUES
  ('ISSS',      0.0300, 'STA', NOW(), NOW(), 4, 'Deducciones mayo 2025'),
  ('AFP',       0.0725, 'STA', NOW(), NOW(), 4, 'Deducciones mayo 2025');
-- ('INSAFORP',  0.0100, 'STA', NOW(), NOW(), 4, 'Deducciones mayo 2025')