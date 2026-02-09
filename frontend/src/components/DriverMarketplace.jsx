import React, { useState, useEffect } from "react";
import api from "../config/axios";
import Layout from "./Layout";
import { useNavigate } from "react-router-dom";
import { IoBicycle, IoTime } from "react-icons/io5";

const DriverMarketplace = () => {
    const [orders, setOrders] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        getOpenOrders();
    }, []);

    const getOpenOrders = async () => {
        try {
            // Ambil semua order
            const response = await api.get("http://localhost:5000/drivers/orders");
            const allOrders = response.data.data || response.data;

            // Filter di Frontend: Hanya tampilkan yang statusnya 'finding_driver'
            // (Idealnya filter ini di Backend, tapi untuk MVP ini oke)
            const openOrders = allOrders.filter(
                (order) => order.status === "finding_driver",
            );
            setOrders(openOrders);
        } catch (error) {
            console.log(error);
        }
    };

    const acceptOrder = async (orderId) => {
        // Konfirmasi dulu biar gak kepencet
        if (!window.confirm("Apakah Anda yakin ingin mengambil orderan ini?"))
            return;

        try {
            await api.patch(`http://localhost:5000/orders/${orderId}/accept`);
            alert("Order Berhasil Diambil! Selamat bekerja ✊");
            navigate("/orders"); // Arahkan ke halaman 'Order Saya'
        } catch (error) {
            alert(error.response.data.msg);
        }
    };

    const formatRupiah = (number) => {
        return new Intl.NumberFormat("id-ID", {
            style: "currency",
            currency: "IDR",
            minimumFractionDigits: 0,
        }).format(number);
    };

    return (
        <Layout>
            <h1 className="text-3xl font-bold text-gray-800 mb-6">
                Bursa Order Masuk 🔔
            </h1>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {orders.length === 0 ? (
                    <div className="col-span-3 text-center py-10">
                        <p className="text-gray-400 text-lg">
                            Belum ada orderan masuk. Sabar ya...
                        </p>
                    </div>
                ) : (
                    orders.map((order) => (
                        <div
                            key={order.order_id}
                            className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition border border-gray-100"
                        >
                            <div className="p-6">
                                <div className="flex justify-between items-start mb-4">
                                    <span className="bg-yellow-100 text-yellow-800 text-xs font-semibold px-2.5 py-0.5 rounded">
                                        {order.resi_code}
                                    </span>
                                    <span className="text-gray-500 text-xs flex items-center gap-1">
                                        <IoTime /> Baru saja
                                    </span>
                                </div>

                                <h3 className="text-lg font-bold text-gray-800 mb-1">
                                    {formatRupiah(order.total_harga)}
                                </h3>
                                <p className="text-sm text-gray-500 mb-4">
                                    {order.jarak_km} km
                                </p>

                                <div className="space-y-3 mb-6">
                                    <div className="flex gap-2">
                                        <div className="mt-1 min-w-2.5 h-2.5 rounded-full bg-green-500"></div>
                                        <div>
                                            <p className="text-xs text-gray-400">
                                                Jemput
                                            </p>
                                            <p className="text-sm font-medium text-gray-700">
                                                {order.pickup_address}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex gap-2">
                                        <div className="mt-1 min-w-2.5 h-2.5 rounded-full bg-red-500"></div>
                                        <div>
                                            <p className="text-xs text-gray-400">
                                                Tujuan
                                            </p>
                                            <p className="text-sm font-medium text-gray-700">
                                                {order.dropoff_address}
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                <button
                                    onClick={() => acceptOrder(order.order_id)}
                                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg flex items-center justify-center gap-2 transition"
                                >
                                    <IoBicycle size={20} /> Ambil Order
                                </button>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </Layout>
    );
};

export default DriverMarketplace;
