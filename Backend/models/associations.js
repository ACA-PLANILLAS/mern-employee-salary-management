// models/associations.js
import DataPegawai from './DataPegawaiModel.js';
import PensionInstitution from './PensionInstitutionModel.js';
import PositionHistory from './PositionHistoryModel.js';
import DataJabatan from './DataJabatanModel.js';

// Relaciones
DataPegawai.belongsTo(PensionInstitution, {
  foreignKey: 'pension_institution_code',
  targetKey: 'code',
  as: 'pensionInstitution',
});

DataPegawai.hasMany(PositionHistory, {
  foreignKey: 'employee_id',
  as: 'positionHistory',
});

PositionHistory.belongsTo(DataPegawai, {
  foreignKey: 'employee_id',
  as: 'employee',
});

PositionHistory.belongsTo(DataJabatan, {
  foreignKey: 'position_id',
  as: 'position',
});

export {
    DataPegawai,
    PensionInstitution,
    PositionHistory,
    DataJabatan
  };