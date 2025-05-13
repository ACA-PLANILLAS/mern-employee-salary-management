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

-- aaaaaaaaaaaaaaaaaaaaaaaa
-- aaaaaaaaaaaaaaaaaaaaaaaa
-- aaaaaaaaaaaaaaaaaaaaaaaa
-- aaaaaaaaaaaaaaaaaaaaaaaa
-- aaaaaaaaaaaaaaaaaaaaaaaa
-- aaaaaaaaaaaaaaaaaaaaaaaa


-- 1) Update existing `data_pegawai` → `data_employee`
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

ALTER TABLE `data_pegawai`

  -- Identification
  ADD COLUMN `dui_or_nit`                 VARCHAR(14)   DEFAULT NULL   AFTER `nik`,                         -- “nit_dui”
  ADD COLUMN `document_type`              VARCHAR(16)       DEFAULT NULL   AFTER `dui_or_nit`, 





-- 2) Pension institutions catalog in English
DROP TABLE IF EXISTS `pension_institutions`;
CREATE TABLE `pension_institutions` (
  `code` CHAR(3)           NOT NULL PRIMARY KEY,              -- e.g. COF, MAX, ISP, ISS
  `name` VARCHAR(255)      NOT NULL,                          -- full name
  `institution_type` ENUM('AFP','ISS','ISP') NOT NULL        -- category
) ENGINE=InnoDB DEFAULT CHARSET=utf8;


-- 2) Poblar el catálogo
INSERT INTO pension_institutions(code, name, institution_type) VALUES
  ('COF', 'AFP Confía',                      'AFP'),
  ('MAX', 'AFP Crecer',                      'AFP'),
  ('ISP', 'Instituto Salvadoreño de Pensiones', 'ISP'),
  ('ISS', 'Unidad de Pensiones del ISSS',    'ISS');


-- 3) Link `data_pegawai.pension_institution_code` to the catalog
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
