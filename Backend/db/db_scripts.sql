USE db_penggajian3;

ALTER TABLE potongan_gaji MODIFY jml_potongan DOUBLE(10,2);

CREATE TABLE parameters (
  id int NOT NULL AUTO_INCREMENT,
  name varchar(100) DEFAULT NULL,
  value int DEFAULT NULL,
  type varchar(4) NOT NULL,
  PRIMARY KEY (id),
  UNIQUE KEY type (type)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

INSERT INTO parameters
(id, name, value, type)
VALUES(1, 'horas semanales', 44, 'HWEK');
INSERT INTO parameters
(id, name, value, type)
VALUES(2, 'dias semanales', 6, 'DWEK');
INSERT INTO parameters
(id, name, value, type)
VALUES(3, 'pagos en mes', 2, 'PMON');


ALTER TABLE data_kehadiran
ADD COLUMN worked_hours int(11),
ADD COLUMN tahun int(6),
ADD COLUMN additional_payments DOUBLE(10,2),
ADD COLUMN vacation_payments DECIMAL(10,2),
ADD COLUMN vacation_days int(11),
ADD COLUMN comment_01 VARCHAR(255),
ADD COLUMN comment_02 VARCHAR(255);

DROP TABLE IF EXISTS `potongan_gaji`;

CREATE TABLE potongan_gaji (
  id             INT(11) NOT NULL AUTO_INCREMENT,
  potongan       VARCHAR(120) NOT NULL,
  jml_potongan   DECIMAL(10,2) DEFAULT 0,
  `from`         DECIMAL(10,2) DEFAULT 0,
  `until`        DECIMAL(10,2) DEFAULT 0,
  value_d        DECIMAL(10,2) DEFAULT 0,
  type           ENUM('STA','DIN') DEFAULT 'STA',
  createdAt      DATETIME NOT NULL,
  updatedAt      DATETIME NOT NULL,
  PRIMARY KEY (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

INSERT INTO potongan_gaji
  (`id`, `potongan`, `jml_potongan`, `from`, `until`, `value_d`, `type`, `createdAt`, `updatedAt`)
VALUES
  (1, 'ISSS',  0.13, 0.0,   0.0,   0.0, 'STA', '2025-05-06 03:26:19', '2025-05-08 22:30:00'),
  (2, 'AFP',   0.15, 0.0,   0.0,   0.0, 'STA', '2025-05-06 03:26:19', '2025-05-08 22:30:00'),
  (3, 'RENTA', 0.00, 0.0, 500.0,   0.0, 'DIN', '2025-05-06 03:26:19', '2025-05-06 03:26:19');

ALTER TABLE data_kehadiran
  ADD COLUMN `month` int(6),
  ADD COLUMN `day` int(6);

-- aaaaaaaaaaaaaaaaaaaaaaaa
-- aaaaaaaaaaaaaaaaaaaaaaaa
-- aaaaaaaaaaaaaaaaaaaaaaaa
-- aaaaaaaaaaaaaaaaaaaaaaaa
-- aaaaaaaaaaaaaaaaaaaaaaaa
-- aaaaaaaaaaaaaaaaaaaaaaaa

USE db_penggajian3;

ALTER TABLE `data_pegawai`
  -- DROP COLUMN `nama_pegawai`,
  -- DROP COLUMN `tanggal_masuk`,
  -- Identification
  ADD COLUMN `dui_or_nit`                 VARCHAR(14)   DEFAULT NULL   AFTER `nik`,                         -- “nit_dui”
  ADD COLUMN `document_type`              VARCHAR(16)       DEFAULT NULL   AFTER `dui_or_nit`,                -- “tipo_documento”
  ADD COLUMN `isss_affiliation_number`    CHAR(9)       DEFAULT NULL   AFTER `document_type`,             -- “numero_afiliacion_isss”
  ADD COLUMN `pension_institution_code`   CHAR(5)       DEFAULT NULL   AFTER `isss_affiliation_number`,   -- “institucion_previsional”
  -- Names
  ADD COLUMN `first_name`                 VARCHAR(40)   NOT NULL       AFTER `pension_institution_code`, -- “primer_nombre”
  ADD COLUMN `middle_name`                VARCHAR(40)   DEFAULT NULL   AFTER `first_name`,               -- “segundo_nombre”
  ADD COLUMN `last_name`                  VARCHAR(40)   NOT NULL       AFTER `middle_name`,              -- “primer_apellido”
  ADD COLUMN `second_last_name`           VARCHAR(40)   DEFAULT NULL   AFTER `last_name`,                -- “segundo_apellido”
  ADD COLUMN `maiden_name`                VARCHAR(40)   DEFAULT NULL   AFTER `second_last_name`,         -- “apellido_casada”
  -- Employment dates
  ADD COLUMN `hire_date`                  DATE          DEFAULT NULL       AFTER `maiden_name`,              -- “fecha_ingreso”
  ADD COLUMN `last_position_change_date`  DATE          DEFAULT NULL       AFTER `jabatan`,                 -- “fecha_ultimo_cambio_puesto”
  -- Financial / loans
  ADD COLUMN `monthly_salary`             DECIMAL(11,2) DEFAULT NULL       AFTER `last_position_change_date`,-- “salario”
  ADD COLUMN `has_active_loan`            TINYINT(1)    NOT NULL  DEFAULT 0 AFTER `monthly_salary`,             -- “tiene_prestamo”
  ADD COLUMN `loan_original_amount`       DECIMAL(11,2) DEFAULT NULL   AFTER `has_active_loan`,           -- “prestamo_monto_inicial”
  ADD COLUMN `loan_outstanding_balance`   DECIMAL(11,2) DEFAULT NULL   AFTER `loan_original_amount`,      -- “prestamo_saldo_actual”
  ADD COLUMN `loan_monthly_installment`   DECIMAL(11,2) DEFAULT NULL   AFTER `loan_outstanding_balance`,  -- “prestamo_cuota_mensual”
  ADD COLUMN `loan_start_date`            DATE          DEFAULT NULL   AFTER `loan_monthly_installment`; -- “prestamo_fecha_inicio”

 --ALTER TABLE `data_pegawai`
  -- Identification
   --ADD COLUMN `dui_or_nit`                 VARCHAR(14)   DEFAULT NULL   AFTER `nik`,                         -- “nit_dui”
   --ADD COLUMN `document_type`              VARCHAR(16)       DEFAULT NULL   AFTER `dui_or_nit`;

SET FOREIGN_KEY_CHECKS = 0;
TRUNCATE TABLE data_pegawai;
SET FOREIGN_KEY_CHECKS = 1;

ALTER TABLE `data_pegawai`
  DROP COLUMN `nama_pegawai`,
  DROP COLUMN `tanggal_masuk`,
   DROP COLUMN `jabatan`;

INSERT INTO data_pegawai (
      id_pegawai,
      hire_date,
      nik,
      first_name,
        last_name,
      username,
      password,
      jenis_kelamin,
      status,
      photo,
      url,
      hak_akses,
      createdAt,
      updatedAt
    ) VALUES (
      'a1b2c3d4-e5f6-7890-ab12-cd34ef56gh12',  -- id_pegawai (UUID)
      STR_TO_DATE('01-07-23', '%d-%m-%y'),
      '334455',                               -- NIK
        '1',                               -- Username
          '2',                               -- Username
      'user777',                               -- Username
      '$argon2i$v=19$m=16,t=2,p=1$S2xtQ0xkOU16ckt5enZvWFNtcTI5cEZtSDdHb0ZrXzM$sQch0yEbQ0L5/oY7+hzwHQ',   -- Password (hash Argon2id)
      'Laki-Laki',                            -- Gnero
      'karyawan tetap',                       -- Estado
      'carlos.jpg',                           -- Nombre de archivo foto
      'http://localhost:5000/images/carlos.jpg', -- URL foto
      'admin',                              -- Rol/hak_akses
      NOW(),                                  -- createdAt
      NOW()                                   -- updatedAt
    );


-- Pension institutions catalog in English
DROP TABLE IF EXISTS `pension_institutions`;
CREATE TABLE `pension_institutions` (
  `code` CHAR(3)           NOT NULL PRIMARY KEY,              -- e.g. COF, MAX, ISP, ISS
  `name` VARCHAR(255)      NOT NULL,                          -- full name
  `institution_type` ENUM('AFP','ISS','ISP') NOT NULL        -- category
) ENGINE=InnoDB DEFAULT CHARSET=utf8;


--  Poblar el catálogo
INSERT INTO pension_institutions(code, name, institution_type) VALUES
  ('COF', 'AFP Confía',                      'AFP'),
  ('MAX', 'AFP Crecer',                      'AFP'),
  ('ISP', 'Instituto Salvadoreño de Pensiones', 'ISP'),
  ('ISS', 'Unidad de Pensiones del ISSS',    'ISS');

--  Link `data_pegawai.pension_institution_code` to the catalog
ALTER TABLE `data_pegawai`
  MODIFY COLUMN `pension_institution_code` CHAR(5) DEFAULT NULL,
  ADD CONSTRAINT `fk_employee_pension`
    FOREIGN KEY (`pension_institution_code`)
    REFERENCES `pension_institutions`(`code`)
    ON UPDATE CASCADE
    ON DELETE RESTRICT;


DROP TABLE IF EXISTS `position_history`;

CREATE TABLE `position_history` (
  `id` INT(11) NOT NULL AUTO_INCREMENT,
  `employee_id`        INT(11) NOT NULL,  -- data_pegawai.id
  `position_id`        INT(11) NOT NULL,  -- data_jabatan.id
  `start_date`         DATE    NOT NULL,  -- fecha_inicio
  `end_date`           DATE    DEFAULT NULL, -- fecha_fin
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_pos_hist_emp` (`employee_id`),
  KEY `fk_pos_hist_pos` (`position_id`),
  CONSTRAINT `fk_pos_hist_emp` FOREIGN KEY (`employee_id`)
    REFERENCES `data_pegawai` (`id`)
    ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fk_pos_hist_pos` FOREIGN KEY (`position_id`)
    REFERENCES `data_jabatan` (`id`)
    ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8; 

ALTER TABLE `data_pegawai`
  MODIFY COLUMN `nik` VARCHAR(16) NULL, 
  MODIFY COLUMN `document_type` VARCHAR(16) NULL;


ALTER TABLE `data_pegawai`
  DROP COLUMN jabatan;


ALTER TABLE potongan_gaji
  ADD COLUMN payment_frequency TINYINT NULL DEFAULT 1,
  ADD COLUMN deduction_group VARCHAR(120) NULL;
