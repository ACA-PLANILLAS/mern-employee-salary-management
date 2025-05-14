import { Sequelize } from 'sequelize';
import db from '../config/Database.js';

const { DataTypes } = Sequelize;

const PotonganGaji = db.define('potongan_gaji', {
    id: {
        type: DataTypes.INTEGER(11),
        allowNull: false,
        autoIncrement: true,
        primaryKey: true
    },
    potongan: {
        type: DataTypes.STRING(120),
        allowNull: false
    },
    jml_potongan: {
        type: DataTypes.DECIMAL(2),
        allowNull: false
    },
    from: {
        type: DataTypes.DECIMAL(2),
        defaultValue: 0,
        allowNull: false
    },
    until: {
        type: DataTypes.DECIMAL(2),
        defaultValue: 0,
        allowNull: false
    },
    value_d: {
        type: DataTypes.DECIMAL(2),
        defaultValue: 0,
        allowNull: false
    },
    type: {
        type: DataTypes.ENUM('STA', 'DIN'),
        defaultValue: 'STA',
        allowNull: false
    }
}, {
    freezeTableName: true
});

export default PotonganGaji;