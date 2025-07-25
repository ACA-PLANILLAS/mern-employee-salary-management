import { Sequelize } from "sequelize";
import db from "../config/Database.js";
import PensionInstitution from "./PensionInstitutionModel.js";
import PositionHistory from "./PositionHistoryModel.js";

const { DataTypes } = Sequelize;

const DataPegawai = db.define(
  "data_pegawai",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    id_pegawai: {
      type: DataTypes.STRING,
      defaultValue: DataTypes.UUIDV4,
      allowNull: false,
      validate: { notEmpty: true },
    },
    nik: {
      type: DataTypes.STRING(16),
      allowNull: true,
    },
    dui_or_nit: {
      type: DataTypes.STRING(40),
      allowNull: true,
    },
    document_type: {
      type: DataTypes.CHAR(16),
      allowNull: true,
    },
    isss_affiliation_number: {
      type: DataTypes.CHAR(40),
      allowNull: true,
    },
    pension_institution_code: {
      type: DataTypes.CHAR(3),
      allowNull: true,
    },
    first_name: {
      type: DataTypes.STRING(40),
      allowNull: false,
    },
    middle_name: {
      type: DataTypes.STRING(40),
      allowNull: true,
    },
    last_name: {
      type: DataTypes.STRING(40),
      allowNull: false,
    },
    second_last_name: {
      type: DataTypes.STRING(40),
      allowNull: true,
    },
    maiden_name: {
      type: DataTypes.STRING(40),
      allowNull: true,
    },
    jenis_kelamin: {
      type: DataTypes.STRING(15),
      allowNull: false,
    },
    hire_date: {
      type: DataTypes.DATEONLY,
      allowNull: true,
    },
    last_position_change_date: {
      type: DataTypes.DATEONLY,
      allowNull: true,
    },
    monthly_salary: {
      type: DataTypes.DECIMAL(11, 2),
      allowNull: true,
    },
    has_active_loan: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    loan_original_amount: {
      type: DataTypes.DECIMAL(11, 2),
      allowNull: true,
    },
    loan_outstanding_balance: {
      type: DataTypes.DECIMAL(11, 2),
      allowNull: true,
    },
    loan_monthly_installment: {
      type: DataTypes.DECIMAL(11, 2),
      allowNull: true,
    },
    loan_start_date: {
      type: DataTypes.DATEONLY,
      allowNull: true,
    },
    username: {
      type: DataTypes.STRING(120),
      allowNull: false,
      unique: true,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    photo: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    url: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    status: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    hak_akses: {
      type: DataTypes.STRING(255),
      allowNull: false,
      validate: { notEmpty: true },
    },
  },
  {
    freezeTableName: true,
    timestamps: true,
  }
);

export default DataPegawai;
