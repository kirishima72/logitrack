import { Sequelize } from "sequelize";
import db from "../config/database.js";

const { DataTypes } = Sequelize;

const User = db.define(
  "users",
  {
    user_id: {
      // <-- Tambahkan Kolom ID
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    full_name: {
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
    role: {
      type: DataTypes.ENUM("admin", "customer"),
      allowNull: false,
      defaultValue: "customer",
    },
    user_address: {
      type: DataTypes.TEXT,
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

export default User;
