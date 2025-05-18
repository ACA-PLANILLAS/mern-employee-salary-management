USE db_penggajian3;

ALTER TABLE data_jabatan
MODIFY COLUMN gaji_pokok DECIMAL(15,7) NOT NULL,
MODIFY COLUMN tj_transport DECIMAL(15,7) NOT NULL,
MODIFY COLUMN uang_makan DECIMAL(15,7) DEFAULT NULL;

ALTER TABLE potongan_gaji
MODIFY COLUMN jml_potongan DECIMAL(15,7) DEFAULT 0,
MODIFY COLUMN `from` DECIMAL(15,7) DEFAULT 0,
MODIFY COLUMN `until` DECIMAL(15,7) DEFAULT 0,
MODIFY COLUMN value_d DECIMAL(15,7) DEFAULT 0;


TRUNCATE potongan_gaji;

-- 1) Remuneraciones semanales (payment_frequency = 1)
INSERT INTO potongan_gaji
  (potongan, jml_potongan, `from`, `until`, value_d, type, createdAt, updatedAt, payment_frequency, deduction_group)
VALUES
  ('I Tramo',   0.000,  0.01,  137.50, 0.00, 'DIN', NOW(), NOW(), 1, 'Remuneraciones semanales'),
  ('II Tramo', 0.1000, 137.51, 223.81, 4.42, 'DIN', NOW(), NOW(), 1, 'Remuneraciones semanales'),
  ('III Tramo',0.2000, 223.82, 509.52,15.00, 'DIN', NOW(), NOW(), 1, 'Remuneraciones semanales'),
  ('IV Tramo', 0.3000, 509.53,  -1,  72.14, 'DIN', NOW(), NOW(), 1, 'Remuneraciones semanales');

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
  ('I Tramo',   0.000,    0.01,  550.00,   0.00, 'DIN', NOW(), NOW(), 4, 'Remuneraciones mensuales'),
  ('II Tramo', 0.1000, 550.01,  895.24,  17.67, 'DIN', NOW(), NOW(), 4, 'Remuneraciones mensuales'),
  ('III Tramo',0.2000, 895.25, 2038.10,  60.00, 'DIN', NOW(), NOW(), 4, 'Remuneraciones mensuales'),
  ('IV Tramo', 0.3000,2038.11,    -1, 288.57, 'DIN', NOW(), NOW(), 4, 'Remuneraciones mensuales');

-- Aportaciones legales (pago mensual)
INSERT INTO potongan_gaji
  (potongan, jml_potongan, type, createdAt, updatedAt, payment_frequency, deduction_group)
VALUES
  ('ISSS',      0.0300, 'STA', NOW(), NOW(), 4, 'Deducciones mayo 2025'),
  ('AFP',       0.0725, 'STA', NOW(), NOW(), 4, 'Deducciones mayo 2025');
-- ('INSAFORP',  0.0100, 'STA', NOW(), NOW(), 4, 'Deducciones mayo 2025')



INSERT INTO parameters (id, name, value, type)
VALUES
  (4, 'DUI/NIT del Empleador', 0614200595, 'DUIN');
INSERT INTO parameters (id, name, value, type)
VALUES
  (5, 'Número patronal ISSS', 12345678, 'NPIS');
INSERT INTO parameters (id, name, value, type)
VALUES
  (6, 'Correlativo Centro de Trabajo ISSS', 876543, 'CCTS');
INSERT INTO parameters (id, name, value, type)
VALUES
  (7, 'Nombre de la empresa', 1, 'COMP');
