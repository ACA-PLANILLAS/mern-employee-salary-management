import { Sequelize } from "sequelize";
import db from "../config/Database.js";

const { DataTypes } = Sequelize;

const PensionInstitution = db.define(
  "pension_institutions",
  {
    code: {
      type: DataTypes.CHAR(3),
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    institution_type: {
      type: DataTypes.ENUM("AFP", "ISS", "ISP"),
      allowNull: false,
    },
  },
  {
    freezeTableName: true,
    timestamps: false,
  }
);

export default PensionInstitution;
