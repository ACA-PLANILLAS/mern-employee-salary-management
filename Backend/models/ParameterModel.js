import { Sequelize } from 'sequelize';
import db from '../config/Database.js';

const { DataTypes } = Sequelize;

const Parameter = db.define('Parameter', {
    id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true
    },
    name: {
        type: DataTypes.STRING(100),
        allowNull: true
    },
    value: {
        type: DataTypes.INTEGER,
        allowNull: true
    },
    type: {
        type: DataTypes.STRING(4),
        allowNull: false,
        unique: true
    }
}, {
    tableName: 'parameters',
    timestamps: false
});

export default Parameter;