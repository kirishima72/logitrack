import { Sequelize } from "sequelize";
import db from "../config/database.js";

const { DataTypes } = Sequelize;

const Order = db.define(
  "orders",
  {
    order_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    driver_id: {
      type: DataTypes.INTEGER,
    },

    resi_code: {
      type: DataTypes.STRING(30),
      unique: true,
      allowNull: false,
    },
    jenis_paket: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    berat_paket_kg: {
      type: DataTypes.DECIMAL(5, 2),
      allowNull: false,
    },
    jarak_km: {
      type: DataTypes.DECIMAL(5, 2),
    },
    total_harga: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },

    pickup_address: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    pickup_lat: {
      type: DataTypes.DECIMAL(10, 8),
      allowNull: false,
    },
    pickup_long: {
      type: DataTypes.DECIMAL(11, 8),
      allowNull: false,
    },

    dropoff_address: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    dropoff_lat: {
      type: DataTypes.DECIMAL(10, 8),
      allowNull: false,
    },
    dropoff_long: {
      type: DataTypes.DECIMAL(11, 8),
      allowNull: false,
    },

    status: {
      type: DataTypes.ENUM(
        "pending",
        "finding_driver",
        "pickup",
        "delivery",
        "completed",
        "cancelled"
      ),
      defaultValue: "pending",
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

export default Order;
