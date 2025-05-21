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
  (7, 'Nombre de la empresa',              'AdventureWorks S.A.','STRING','COMP');