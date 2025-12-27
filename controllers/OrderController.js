import db from "../config/Database.js";
import Order from "../models/OrderModel.js";
import User from "../models/UserModel.js";
import { Op } from "sequelize"; // Operator logic Sequelize

export const getOrders = async (req, res) => {
    try {
        let response;
        // Logika: Kalau Admin boleh lihat semua, Kalau Customer cuma lihat punya sendiri
        if (req.role === "admin") {
            response = await Order.findAll({
                include: [{ model: User, attributes: ["full_name", "email"] }], // Join tabel User
            });
        } else {
            response = await Order.findAll({
                where: {
                    user_id: req.userId, // Filter cuma punya dia (dari middleware)
                },
                include: [{ model: User, attributes: ["full_name", "email"] }],
            });
        }
        res.status(200).json(response);
    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
};

export const getOrderById = async (req, res) => {
    try {        
        const response = await Order.findOne({
            where: {
                order_id: req.params.id
            }
        });

        if (!response) {
            return res.status(404).json({
                msg: "Order tidak ditemukan",
            });
        }

        res.status(200).json({
            msg: "Detail Order ditemukan",
            data: response
        });
        
    } catch (error) {
        res.status(500).json({ msg: "Terjadi kesalahan server" });
    }
};

export const getOrderByResi = async (req, res) => {
    try {

        const response = await Order.findOne({
            where: {
                resi_code: req.params.resi_code
            }
        });

        if (!response) {
            return res.status(404).json({
                msg: "Nomor Resi tidak ditemukan",
            });
        }

        res.status(200).json({
            msg: "Nomor Resi ditemukan",
            data: response,
        });
    } catch (error) {
        res.status(500).json({ msg: "Terjadi Kesalahan Server" });
    }
};

export const createOrder = async (req, res) => {
    // Data dari input user (Frontend)
    const {
        jenis_paket,
        berat_paket_kg,
        pickup_address,
        pickup_lat,
        pickup_long,
        dropoff_address,
        dropoff_lat,
        dropoff_long,
    } = req.body;

    const randomStr = Math.random().toString(36).substring(2, 7).toUpperCase();
    const resi = `LGT-${Date.now()}-${randomStr}`;

    const harga = berat_paket_kg * 5000 + 2000;

    try {
        await Order.create({
            resi_code: resi,
            jenis_paket: jenis_paket,
            berat_paket_kg: berat_paket_kg,
            total_harga: harga,
            pickup_address: pickup_address,
            pickup_lat: pickup_lat,
            pickup_long: pickup_long,
            dropoff_address: dropoff_address,
            dropoff_lat: dropoff_lat,
            dropoff_long: dropoff_long,
            user_id: req.userId, // Ambil ID dari Session (Middleware)
            status: "pending", // Default status
        });
        res.status(201).json({ msg: "Order Berhasil Dibuat", resi: resi });
    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
};
