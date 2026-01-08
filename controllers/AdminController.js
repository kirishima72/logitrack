import Order from "../models/OrderModel.js";
import User from "../models/UserModel.js";
import Driver from "../models/DriverModel.js";

export const getDashboardStats = async (req, res) => {
    try {
        // Total Customer
        const customerCount = await User.count({
            where: {
                role: "customer",
            },
        });

        // Driver total & yang aktif
        const driverTotal = await Driver.count();
        const driverActive = await Driver.count({
            where: {
                is_active: true,
            },
        });

        // Order Total & Yang Selesai
        const orderTotal = await Order.count();
        const orderCompleted = await Order.count({
            where: {
                status: "completed",
            },
        });

        // omzet barang sudah dikirim
        const totalIncome = await Order.sum("total_harga", {
            where: {
                status: "completed",
            },
        });

        res.status(200).json({
            msg: "Dashboard Statistics",
            data: {
                users: {
                    total_customer: customerCount,
                },
                drivers: {
                    total: driverTotal,
                    active: driverActive,
                    offline: driverTotal - driverActive,
                },
                orders: {
                    total: orderTotal,
                    completed: orderCompleted,
                    pending: orderTotal - orderCompleted,
                },
                finance: {
                    // Jika null (belum ada order), ganti jadi 0
                    total_revenue: totalIncome || 0,
                },
            },
        });
    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
};
