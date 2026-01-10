import express from "express";
import fileUpload from "express-fileupload";
import cors from "cors";
import session from "express-session";
import dotenv from "dotenv";
import SequelizeStore from "connect-session-sequelize";

// [PENTING] 1. Import module tambahan untuk Socket.io
import http from "http";
import { Server } from "socket.io";

import db from "./config/database.js";
import User from "./models/UserModel.js";
import Driver from "./models/DriverModel.js";
import Order from "./models/OrderModel.js";
import UserRoute from "./routes/UserRoute.js";
import OrderRoute from "./routes/OrderRoute.js";
import DriverRoute from "./routes/DriverRoute.js";

dotenv.config();

const app = express();

// [PENTING] 2. Bungkus Express app dengan HTTP Server
const server = http.createServer(app);

// [PENTING] 3. Inisialisasi Socket.io pada server tersebut
const io = new Server(server, {
    cors: {
        origin: "*", // Sesuaikan dengan URL Frontend nanti (React/Vue)
        methods: ["GET", "POST", "PATCH", "DELETE"]
    }
});

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
    origin: true, // (Opsional) Persiapan buat Frontend nanti
}));

app.use(express.json());
app.use(fileUpload());
app.use(express.static("public"));

// [PENTING] 4. Middleware agar 'io' bisa dipanggil di Controller
// Logikanya: Setiap ada request masuk, kita "titipkan" tombol socket ke req
app.use((req, res, next) => {
    req.io = io;
    next();
});

// Routes
app.use(UserRoute);
app.use(OrderRoute);
app.use(DriverRoute);

// Generate Tabel Session Otomatis
// store.sync(); // Nyalakan ini SEKALI aja pas pertama kali run, terus komen lagi biar gak berat.

// [PENTING] 5. Deteksi jika ada user connect ke socket (Untuk Debugging console)
io.on('connection', (socket) => {
    console.log('⚡ Seorang user terhubung ke Socket.io ID:', socket.id);
    
    socket.on('disconnect', () => {
        console.log('❌ User disconnect', socket.id);
    });
});

// [PENTING] 6. Ganti app.listen jadi server.listen
// Kalau pakai app.listen, socket.io tidak akan jalan!
server.listen(process.env.APP_PORT, () => {
    console.log('Server up and running...');
});

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
