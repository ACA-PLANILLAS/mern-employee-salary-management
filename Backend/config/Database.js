import { Sequelize } from 'sequelize';

const sequelize = new Sequelize('database_name', 'username', 'password', {
  host: 'localhost',
  dialect: 'mysql', // Cambia esto según tu base de datos (mysql, postgres, etc.)
});

export { Sequelize, sequelize }; // Exporta tanto Sequelize como la instancia sequelize
export default sequelize;