import { Sequelize } from 'sequelize';
import { sequelize } from '../config/Database.js';

const DataPegawaiModel = sequelize.define('DataPegawai', {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  name: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  nik: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  // ...otros campos...
}, {
  tableName: 'data_pegawai', // Nombre de la tabla en la base de datos
  timestamps: false, // Si no usas createdAt y updatedAt
});

export default DataPegawaiModel;
