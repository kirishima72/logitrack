import Order from "../models/OrderModel.js";
import User from "../models/UserModel.js";
import { calculateDistance, calculatePrice } from "./CommonFunction.js";
import path from "path";
import fs from "fs";

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
                order_id: req.params.id,
            },
        });

        if (!response) {
            return res.status(404).json({
                msg: "Order tidak ditemukan",
            });
        }

        res.status(200).json({
            msg: "Detail Order ditemukan",
            data: response,
        });
    } catch (error) {
        res.status(500).json({ msg: "Terjadi kesalahan server" });
    }
};

export const getOrderByResi = async (req, res) => {
    try {
        const response = await Order.findOne({
            where: {
                resi_code: req.params.resi_code,
            },
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

    if (!pickup_lat || !pickup_long || !dropoff_lat || !dropoff_long)
        return res.status(400).json({ msg: "Koordinat lokasi tidak lengkap!" });

    const randomStr = Math.random().toString(36).substring(2, 7).toUpperCase();
    const resi = `LGT-${Date.now()}-${randomStr}`;

    // const harga = berat_paket_kg * 5000 + 2000;

    const dist = calculateDistance(
        parseFloat(pickup_lat),
        parseFloat(pickup_long),
        parseFloat(dropoff_lat),
        parseFloat(dropoff_long)
    );

    const harga = calculatePrice(dist);

    // Format jarak biar cantik (cuma 1 angka di belakang koma, misal: 5.2 km)
    const finalDistance = dist.toFixed(1);

    try {
        await Order.create({
            resi_code: resi,
            user_id: req.userId, // Ambil ID dari Session (Middleware)
            jenis_paket: jenis_paket,
            berat_paket_kg: berat_paket_kg,
            jarak_km: finalDistance,
            total_harga: harga,

            pickup_address: pickup_address,
            pickup_lat: pickup_lat,
            pickup_long: pickup_long,

            dropoff_address: dropoff_address,
            dropoff_lat: dropoff_lat,
            dropoff_long: dropoff_long,

            status: "finding_driver", // Default status
        });
        res.status(201).json({
            msg: "Order Berhasil Dibuat",
            data: { 
                resi: resi,
                jarak: finalDistance + " km",
                harga: "Rp " + harga.toLocaleString()
            }
        });
    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
};

export const acceptOrder = async (req, res) => {
    try {
        const order = await Order.findOne({
            where: {
                order_id: req.params.id,
                status: "finding_driver",
            },
        });

        if (!order) {
            return res.status(404).json({
                msg: "Order tidak ditemukan atau sudah diambil driver lain.",
            });
        }

        await Order.update(
            {
                status: "pickup",
                driver_id: req.driverId, // Ambil ID Driver dari session login
            },
            {
                where: {
                    order_id: order.order_id,
                },
            }
        );

        // Cari data driver biar notifikasinya lengkap (ada nama & plat nomor)
        const driverInfo = await User.findOne({
            where: {
                user_id: req.driverId,
            }
        });

        // "Tembak" event ke semua orang yang sedang connect
        // Nama eventnya: "order_taken" (nanti Frontend dengerin event ini)
        req.io.emit("order_taken", {
            message: `Order ${order.resi_code} telah diterima driver!`,
            order_id: order.order_id,
            resi: order.resi_code,
            driver_name: driverInfo.driver_name,
            plat_nomor: driverInfo.vehicle_number,
            status: "pickup"
        });

        res.status(200).json({
            msg: "Order berhasil diterima! Silakan menuju lokasi pickup.",
        });
    } catch (error) {
        res.status(500).json({ msg: "Terjadi kesalahan server" });
    }
};

export const updateStatus = async (req, res) => {
    try {
        const order = await Order.findOne({
            where: {
                order_id: req.params.id,
            },
        });

        if (!order)
            return res.status(404).json({ msg: "Order tidak ditemukan" });

        const { status } = req.body;

        await Order.update(
            { status: status },
            {
                where: {
                    order_id: req.params.id,
                },
            }
        );

        res.status(200).json({ msg: "Status Order berhasil diperbarui" });
    } catch (error) {
        res.status(500).json({ msg: "Terjadi kesalahan server" });
    }
};

export const cancelOrder = async (req, res) => {
    try {
        const order = await Order.findOne({
            where: {
                order_id: req.params.id,
            },
        });

        if (!order) res.status(404).json({ msg: "Order tidak ditemukan" });

        if (req.role !== "admin" && order.user_id !== req.userId)
            return res
                .status(403)
                .json({ msg: "Akses terlarang! Ini bukan order Anda." });

        const nonCancellableStatus = ["in_transit", "delivered", "cancelled"];
        if (nonCancellableStatus.includes(order.status)) {
            return res.status(400).json({
                msg: "Order tidak bisa dibatalkan karena sudah diproses atau selesai.",
            });
        }

        await Order.update(
            { status: "cancelled" },
            {
                where: {
                    order_id: order.order_id,
                },
            }
        );

        res.status(200).json({ msg: "Order berhasil dibatalkan" });
    } catch (error) {
        res.status(500).json({ msg: "Terjadi kesalahan server" });
    }
};

export const finishOrder = async (req, res) => {
    try {
        const order = await Order.findOne({
            where: {
                order_id: req.params.id,
                driver_id: req.driverId,
            },
        });

        if (!order)
            return res
                .status(404)
                .json({ msg: "Order tidak ditemukan atau bukan milik Anda." });

        if (order.status !== "pickup" && order.status !== "delivery")
            return res.status(400).json({
                msg: "Order ini tidak dalam proses pengantaran.",
            });

        if (!req.files || !req.files.file)
            return res
                .status(400)
                .json({ msg: "Wajib upload bukti pengiriman" });

        const file = req.files.file;
        const fileSize = file.data.length;
        const ext = path.extname(file.name);

        const fileName = file.md5 + ext;
        const url = `${req.protocol}://${req.get("host")}/uploads/${fileName}`;
        const allowedType = [".png", ".jpg", ".jpeg"];

        if (!allowedType.includes(ext.toLowerCase()))
            return res.status(422).json({
                msg: "Format gambar tidak valid (Gunakan jpg, jpeg, png)",
            });

        if (fileSize > 5000000)
            return res
                .status(422)
                .json({ msg: "Ukuran gambar harus di bawah 5 MB" });

        file.mv(`./public/uploads/${fileName}`, async (err) => {
            if (err) return res.status(500).json({ msg: err.message });

            try {
                await Order.update(
                    {
                        status: "completed",
                        proof_image: fileName,
                    },
                    {
                        where: {
                            order_id: order.order_id,
                        },
                    }
                );

                res.status(200).json({
                    msg: "Order Selesai! Terima kasih atas kerja keras Anda.",
                    url_bukti: url,
                });
            } catch (error) {
                res.status(500).json({ msg: error.message });
            }
        });
    } catch (error) {
        res.status(500).json({ msg: "Terjadi kesalahan server" });
    }
};
