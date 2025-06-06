import { Sequelize } from 'sequelize';
import db from '../config/Database.js';

const { DataTypes } = Sequelize;

const DataKehadiran = db.define('data_kehadiran', {
    id: {
        type: DataTypes.INTEGER(11),
        allowNull: false,
        autoIncrement: true,
        primaryKey: true
    },
    bulan: {
        type: DataTypes.STRING(15),
        allowNull: false
    },
    tahun: {
        type: DataTypes.INTEGER(6),
        allowNull: false
    },
    nik: {
        type: DataTypes.STRING(16),
        allowNull: false
    },
    nama_pegawai: {
        type: DataTypes.STRING(100),
        allowNull: false
    },
    jenis_kelamin: {
        type: DataTypes.STRING(20)
    },
    nama_jabatan: {
        type: DataTypes.STRING(50)
    },
    hadir: {
        type: DataTypes.INTEGER(11)
    },
    sakit: {
        type: DataTypes.INTEGER(11)
    },
    alpha: {
        type: DataTypes.INTEGER(11)
    },
    worked_hours: {
        type: DataTypes.INTEGER(11)
    },
    additional_payments: {
        type: DataTypes.DECIMAL(2),
    },
    vacation_days: {
        type: DataTypes.INTEGER(11)
    },
    vacation_payments: {
        type: DataTypes.DECIMAL(2),
    },
    comment_01: {
        type: DataTypes.STRING(255)
    },
    comment_02: {
        type: DataTypes.STRING(255)
    },
     month: {
        type: DataTypes.INTEGER(6)
    },
     day: {
        type: DataTypes.INTEGER(6)
    },
}, { freezeTableName: true });

export default DataKehadiran