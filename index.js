import express from "express";
import cors from "cors";
import db from "./config/database.js";
import User from './models/UserModel.js';
import Driver from './models/DriverModel.js';
import Order from './models/OrderModel.js';

const app = express();

try {
    await db.authenticate();
    console.log('Database COnnected... ✅');

    // 1. User & Order (One to Many)
    // "Satu User bisa punya banyak Order"
    User.hasMany(Order, { foreignKey: 'user_id' });
    // "Satu Order pasti milik satu User"
    Order.belongsTo(User, { foreignKey: 'user_id' });

    // 2. Driver & Order (One to Many)
    Driver.hasMany(Order, { foreignKey: 'driver_id' });
    Order.belongsTo(Driver, { foreignKey: 'driver_id' });

    // =========================================
    
    // Sinkronisasi Tabel
    // alter: true -> Cek apakah ada perubahan kolom, kalau ada di-update tanpa hapus data
    await db.sync({ alter: true }); 
    console.log('All models were synchronized successfully.');



    await db.sync();
} catch (error) {
    console.log('Connection error: ', error);
}

app.listen(process.env.APP_PORT, ()=> console.log('Server up and running... 🚀'));