import express from "express";
import fileUpload from "express-fileupload";
import cors from "cors";
import session from "express-session";
import dotenv from "dotenv";
import db from "./config/database.js";
import SequelizeStore from "connect-session-sequelize";
import User from "./models/UserModel.js";
import Driver from "./models/DriverModel.js";
import Order from "./models/OrderModel.js";
import UserRoute from "./routes/UserRoute.js";
import OrderRoute from "./routes/OrderRoute.js";
import DriverRoute from "./routes/DriverRoute.js";

dotenv.config();
const app = express();

const sessionStore = SequelizeStore(session.Store);
const store = new sessionStore({
    db: db,
});

app.use(session({
    secret: process.env.SESS_SECRET,
    resave: false,
    saveUninitialized: true,
    store: store, // Simpan session ke Database
    cookie: {
        secure: 'auto', // Auto detect (HTTP/HTTPS)
    },
}));

app.use(cors({
    credentials: true, // Izinkan cookie dikirim antar domain
    origin: "http://localhost:3000", // (Opsional) Persiapan buat Frontend nanti
}));

app.use(express.json());
app.use(fileUpload());
app.use(express.static("public"));

app.use(UserRoute);
app.use(OrderRoute);
app.use(DriverRoute);

// Generate Tabel Session Otomatis
// store.sync(); // Nyalakan ini SEKALI aja pas pertama kali run, terus komen lagi biar gak berat.

try {
    await db.authenticate();
    console.log("Database COnnected... ✅");

    // 1. User & Order (One to Many)
    // "Satu User bisa punya banyak Order"
    User.hasMany(Order, { foreignKey: "user_id" });
    // "Satu Order pasti milik satu User"
    Order.belongsTo(User, { foreignKey: "user_id" });

    // 2. Driver & Order (One to Many)
    Driver.hasMany(Order, { foreignKey: "driver_id" });
    Order.belongsTo(Driver, { foreignKey: "driver_id" });

    // =========================================

    // Sinkronisasi Tabel
    // alter: true -> Cek apakah ada perubahan kolom, kalau ada di-update tanpa hapus data
    // await db.sync({ alter: true }); // Matikan dulu sync tabel model kalau sudah stabil
    console.log("All models were synchronized successfully.");

} catch (error) {
    console.log("Connection error: ", error);
}

app.listen(process.env.APP_PORT, () =>
    console.log("Server up and running... 🚀")
);
