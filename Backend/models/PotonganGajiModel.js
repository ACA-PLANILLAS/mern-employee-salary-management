import { DataTypes } from "sequelize";
import db from "../config/Database.js";

const PotonganGaji = db.define(
    "PotonganGaji",
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        potongan: {
            type: DataTypes.STRING(120),
            allowNull: false,
        },
        jml_potongan: {

            type: DataTypes.DECIMAL(15, 7),
            defaultValue: 0,
        },
        from: {
            type: DataTypes.DECIMAL(15, 7),
            field: "from",
            defaultValue: 0,
        },
        until: {
            type: DataTypes.DECIMAL(15, 7),
            field: "until",
            defaultValue: 0,
        },
        value_d: {
            type: DataTypes.DECIMAL(15, 7),
            defaultValue: 0,
        },
        type: {
            type: DataTypes.ENUM("STA", "DIN"),
            defaultValue: "STA",
        },
        payment_frequency: {
            type: DataTypes.TINYINT,
            defaultValue: 1,
        },
        deduction_group: {
            type: DataTypes.STRING(120),
            allowNull: true,
        },
    },
    {
        tableName: "potongan_gaji",
        timestamps: true,
        createdAt: "createdAt",
        updatedAt: "updatedAt",
    }
);

export default PotonganGaji;
