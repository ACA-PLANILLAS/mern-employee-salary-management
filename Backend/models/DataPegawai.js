import { DataTypes } from 'sequelize';
import db from '../config/Database.js';

const DataPegawai = db.define('DataPegawai', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  nik: {
    type: DataTypes.STRING,
  },
  // ...agrega otras columnas existentes en tu tabla...
}, {
  tableName: 'data_pegawai', // Asegúrate de que el nombre coincida con tu tabla
  timestamps: false, // Cambia esto si tu tabla tiene columnas `createdAt` y `updatedAt`
});

export default DataPegawai;
