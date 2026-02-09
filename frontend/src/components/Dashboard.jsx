import React, { useState, useEffect } from "react";
import Layout from "./Layout";
import api from "../config/axios";
import { useNavigate } from "react-router-dom";
import { IoWallet, IoBagHandle, IoPeople, IoCarSport } from "react-icons/io5";
import { formatRupiah } from "../features/CommonFunction";

const Dashboard = () => {
    const [name, setName] = useState("");
    const [role, setRole] = useState("");

    const [stats, setStats] = useState(null);

    const navigate = useNavigate();

    useEffect(() => {
        getMe();
    }, []);

    useEffect(() => {
        if (role === "admin") {
            getStats();
        }
    }, [role]);

    const getMe = async () => {
        try {
            // Kita coba cek apakah dia User/Admin?
            try {
                const response = await api.get(
                    "http://localhost:5000/users/get-current-user"
                );
                setName(response.data.full_name);
                setRole(response.data.role);
                return; // Jika sukses, stop disini
            } catch (e) {
                console.log("error : ", e);
                // Jika gagal, mungkin dia Driver?
            }

            // Cek apakah dia Driver?
            const responseDriver = await api.get(
                "http://localhost:5000/drivers/get-current-driver"
            );
            setName(responseDriver.data.driver_name);
            setRole("driver");
        } catch (error) {
            console.log("error user & driver : ", error);
            // Jika User & Driver gagal, tendang ke login
            navigate("/");
        }
    };

    const getStats = async () => {
        try {
            const response = await api.get(
                "http://localhost:5000/admin/dashboard"
            );
            setStats(response.data.data);
        } catch (error) {
            console.log("Bukan admin, tidak bisa ambil stats");
        }
    };

    // const formatRupiah = (number) => {
    //     return new Intl.NumberFormat("id-ID", {
    //         style: "currency",
    //         currency: "IDR",
    //     }).format(number);
    // };

    return (
        <Layout>
            <div className="mb-6">
                <h1 className="text-3xl font-bold text-gray-800">Dashboard</h1>
                <h2 className="text-xl text-gray-600">
                    Selamat Datang Kembali,
                    <strong className="text-blue-600 capitalize">{name}</strong>
                </h2>
            </div>

            {/* --- TAMPILAN KHUSUS ADMIN --- */}
            {role === "admin" && stats && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    {/* Card 1: Omzet */}
                    <div className="bg-white p-6 rounded-xl shadow-sm border-l-4 border-green-500 flex items-center justify-between">
                        <div>
                            <p className="text-gray-500 text-sm font-medium">
                                Total Pendapatan
                            </p>
                            <p className="text-xl font-bold text-gray-800">
                                {formatRupiah(stats.finance.total_revenue)}
                            </p>
                        </div>
                        <div className="bg-green-100 p-3 rounded-full text-green-600">
                            <IoWallet size={24} />
                        </div>
                    </div>

                    {/* Card 2: Total Order */}
                    <div className="bg-white p-6 rounded-xl shadow-sm border-l-4 border-blue-500 flex items-center justify-between">
                        <div>
                            <p className="text-gray-500 text-sm font-medium">
                                Total Pesanan
                            </p>
                            <p className="text-2xl font-bold text-gray-800">
                                {stats.orders.total}
                            </p>
                            <span className="text-xs text-green-600">
                                {stats.orders.completed} Selesai
                            </span>
                        </div>
                        <div className="bg-blue-100 p-3 rounded-full text-blue-600">
                            <IoBagHandle size={24} />
                        </div>
                    </div>

                    {/* Card 3: Driver Aktif */}
                    <div className="bg-white p-6 rounded-xl shadow-sm border-l-4 border-purple-500 flex items-center justify-between">
                        <div>
                            <p className="text-gray-500 text-sm font-medium">
                                Driver Mitra
                            </p>
                            <p className="text-2xl font-bold text-gray-800">
                                {stats.drivers.total}
                            </p>
                            <span className="text-xs text-green-600">
                                {stats.drivers.active} Aktif
                            </span>
                        </div>
                        <div className="bg-purple-100 p-3 rounded-full text-purple-600">
                            <IoCarSport size={24} />
                        </div>
                    </div>

                    {/* Card 4: Total User */}
                    <div className="bg-white p-6 rounded-xl shadow-sm border-l-4 border-orange-500 flex items-center justify-between">
                        <div>
                            <p className="text-gray-500 text-sm font-medium">
                                Pelanggan
                            </p>
                            <p className="text-2xl font-bold text-gray-800">
                                {stats.users.total_customer}
                            </p>
                        </div>
                        <div className="bg-orange-100 p-3 rounded-full text-orange-600">
                            <IoPeople size={24} />
                        </div>
                    </div>
                </div>
            )}

            {/* --- TAMPILAN JIKA BUKAN ADMIN (DRIVER/USER) --- */}
            {role !== "admin" && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 text-center">
                    <h3 className="text-lg font-semibold text-blue-800">
                        Status Akun: {role.toUpperCase()}
                    </h3>
                    <p className="text-gray-600 mt-2">
                        Silakan akses menu di sidebar untuk melihat pesanan
                        Anda.
                    </p>
                </div>
            )}
        </Layout>
    );
};

export default Dashboard;
