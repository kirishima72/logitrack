import React, { useState, useEffect } from "react";
import Layout from "./Layout";
import api from "../config/axios";
import { useParams, useNavigate } from "react-router-dom";
import { IoArrowBack, IoPerson, IoCall, IoTime } from "react-icons/io5";

import { formatRupiah } from "../features/CommonFunction";

const OrderDetail = () => {
    const [order, setOrder] = useState(null);
    const { id } = useParams(); // Ambil ID dari URL
    const navigate = useNavigate();

    useEffect(() => {
        getOrderById();
    }, [id]);

    const getOrderById = async () => {
        try {
            const response = await api.get(
                `http://localhost:5000/orders/${id}`,
            );
            setOrder(response.data.data);
        } catch (error) {
            console.log(error);
            alert("Order tidak ditemukan");
            navigate("/orders");
        }
    };

    if (!order)
        return (
            <Layout>
                <div>Loading...</div>
            </Layout>
        );

    return (
        <Layout>
            <button
                onClick={() => navigate(-1)}
                className="flex items-center text-gray-600 mb-4 hover:text-blue-600"
            >
                <IoArrowBack className="mr-2" /> Kembali
            </button>

            <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100">
                {/* Header Status */}
                <div className="bg-blue-600 p-6 text-white flex justify-between items-center">
                    <div>
                        <h1 className="text-2xl font-bold">
                            Order #{order.resi_code}
                        </h1>
                        <p className="opacity-90 text-sm flex items-center gap-2 mt-1">
                            <IoTime /> Dibuat pada:{" "}
                            {new Date(order.created_at).toLocaleString()}
                        </p>
                    </div>
                    <div className="bg-white text-blue-800 px-4 py-2 rounded-lg font-bold uppercase text-sm">
                        {order.status.replace("_", " ")}
                    </div>
                </div>

                <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Kolom Kiri: Detail Pengiriman */}
                    <div>
                        <h2 className="text-lg font-bold text-gray-800 mb-4 border-b pb-2">
                            Rincian Pengiriman
                        </h2>

                        <div className="space-y-4">
                            <div className="flex">
                                <div className="w-8 flex flex-col items-center">
                                    <div className="w-4 h-4 bg-green-500 rounded-full"></div>
                                    <div className="h-full w-0.5 bg-gray-300"></div>
                                </div>
                                <div className="pb-4">
                                    <p className="text-xs text-gray-500 uppercase font-semibold">
                                        Lokasi Jemput
                                    </p>
                                    <p className="text-gray-800 font-medium">
                                        {order.pickup_address}
                                    </p>
                                </div>
                            </div>

                            <div className="flex">
                                <div className="w-8 flex flex-col items-center">
                                    <div className="w-4 h-4 bg-red-500 rounded-full"></div>
                                </div>
                                <div>
                                    <p className="text-xs text-gray-500 uppercase font-semibold">
                                        Lokasi Tujuan
                                    </p>
                                    <p className="text-gray-800 font-medium">
                                        {order.dropoff_address}
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="mt-6 bg-gray-50 p-4 rounded-lg">
                            <p className="text-sm text-gray-600">
                                Jarak Tempuh:{" "}
                                <span className="font-bold text-gray-900">
                                    {order.jarak_km} km
                                </span>
                            </p>
                            <p className="text-sm text-gray-600 mt-1">
                                Total Biaya:{" "}
                                <span className="font-bold text-blue-600 text-lg">
                                    {formatRupiah(order.total_harga)}
                                </span>
                            </p>
                            <p className="text-sm text-gray-600 mt-1">
                                Item: {order.jenis_paket}
                            </p>
                        </div>
                    </div>

                    {/* Kolom Kanan: Info Driver & Bukti */}
                    <div>
                        <h2 className="text-lg font-bold text-gray-800 mb-4 border-b pb-2">
                            Informasi Kurir
                        </h2>

                        {order.driver_id ? (
                            <div className="bg-blue-50 p-4 rounded-lg flex items-center gap-4 mb-6">
                                <div className="bg-blue-200 p-3 rounded-full text-blue-700">
                                    <IoPerson size={24} />
                                </div>
                                <div>
                                    {/* Note: Idealnya backend mengirim object driver, bukan cuma ID. 
                                Tapi untuk sekarang kita tampilkan ID dulu atau nama jika sudah di-include */}
                                    <p className="font-bold text-gray-800">
                                        Driver Mitra
                                    </p>
                                    <p className="text-sm text-gray-600 flex items-center gap-2">
                                        <IoCall size={14} /> 0812-XXXX-XXXX
                                    </p>
                                </div>
                            </div>
                        ) : (
                            <div className="bg-yellow-50 p-4 rounded-lg text-yellow-700 mb-6 text-sm">
                                Sedang mencari driver...
                            </div>
                        )}

                        {/* --- BUKTI FOTO (Hanya muncul jika Delivered) --- */}
                        {order.status === "delivered" && order.proof_image && (
                            <div className="mt-4">
                                <h3 className="text-sm font-bold text-gray-700 mb-2">
                                    📸 Bukti Pengiriman
                                </h3>
                                <div className="border-2 border-dashed border-gray-300 rounded-lg p-2">
                                    <img
                                        src={`http://localhost:5000/uploads/${order.proof_image}`}
                                        alt="Bukti Pengiriman"
                                        className="w-full h-auto rounded-lg shadow-sm"
                                    />
                                </div>
                                <p className="text-xs text-center text-gray-400 mt-2">
                                    Paket telah diterima dengan aman.
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </Layout>
    );
};

export default OrderDetail;
