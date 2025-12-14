import { Sequelize } from "sequelize";
import db from "../config/database.js";

const { DataTypes } = Sequelize;

const Driver = db.define(
  "drivers",
  {
    driver_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    driver_name: {
      type: DataTypes.STRING(150),
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING(100),
      allowNull: false,
      unique: true,
    },
    password_hash: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    phone_number: {
      type: DataTypes.STRING(15),
      allowNull: false,
    },
    vehicle: {
      type: DataTypes.STRING(50),
    },
    vehicle_number: {
      type: DataTypes.STRING(20),
    },
    current_lat: {
      type: DataTypes.DECIMAL(10, 8),
    },
    current_long: {
      type: DataTypes.DECIMAL(11, 8),
    },
    is_active: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    created_at: {
      type: DataTypes.DATE,
      defaultValue: Sequelize.fn("NOW"),
    },
  },
  {
    freezeTableName: true,
    timestamps: false, 
  }
);

export default Driver;
