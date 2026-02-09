import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../config/axios";
import Layout from "./Layout";
import { IoAdd, IoCheckmarkDone, IoCloudUpload } from "react-icons/io5";
import { formatRupiah } from "../features/CommonFunction";

const OrderList = () => {
    const [orders, setOrders] = React.useState([]);

    const [isUploadOpen, setIsUploadOpen] = useState(false);
    const [selectedOrderId, setSelectedOrderId] = useState(null);
    const [file, setFile] = useState(null);

    useEffect(() => {
        getOrders();
    }, []);

    const getOrders = async () => {
        try {
            let response;

            try {
                const isAdminResponse = await api.get(
                    "http://localhost:5000/users/get-current-user",
                );

                if (isAdminResponse.status === 200)
                    response = await api.get("http://localhost:5000/orders/");
                setOrders(response.data);
            } catch (error) {
                const isDriverResponse = await api.get(
                    "http://localhost:5000/drivers/get-current-driver",
                );

                if (isDriverResponse.status === 200) {
                    response = await api.get(
                        "http://localhost:5000/drivers/orders/",
                    );
                }
                setOrders(response.data);
            }

            // Backend mungkin me-return { data: [...] } atau langsung [...]
            // Sesuaikan dengan struktur JSON backend Anda.
            // Jika backend return { msg: "...", data: [...] }, gunakan response.data.data
            // Jika backend return [...] (array langsung), gunakan response.data
        } catch (error) {
            console.log(error);
        }
    };

    const handleFinish = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append("file", file);

        try {
            await api.patch(
                `http://localhost:5000/orders/${selectedOrderId}/finish`,
                formData,
                {
                    headers: { "Content-Type": "multipart/form-data" },
                },
            );
            alert("Order Selesai! Terima kasih.");
            setIsUploadOpen(false);
            getOrders(); // Refresh tabel
        } catch (error) {
            console.log(error);
            alert("Gagal upload bukti.");
        }
    };

    return (
        <Layout>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold text-gray-800">
                    Daftar Pesanan
                </h1>
                <Link
                    to="/orders/add"
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition"
                >
                    <IoAdd size={20} /> Buat Pesanan Baru
                </Link>
            </div>

            <div className="relative overflow-x-auto shadow-md sm:rounded-lg bg-white">
                <table className="w-full text-sm text-left text-gray-500">
                    <thead className="text-xs text-gray-700 uppercase bg-gray-100">
                        <tr>
                            <th className="px-6 py-3">No</th>
                            <th className="px-6 py-3">Resi</th>
                            <th className="px-6 py-3">Pelanggan</th>
                            <th className="px-6 py-3">Tujuan</th>
                            <th className="px-6 py-3">Harga</th>
                            <th className="px-6 py-3">Status</th>
                            <th className="px-6 py-3">Aksi</th>
                        </tr>
                    </thead>
                    <tbody>
                        {orders.length === 0 ? (
                            <tr>
                                <td
                                    colSpan="7"
                                    className="text-center py-6 text-gray-400"
                                >
                                    Belum ada pesanan
                                </td>
                            </tr>
                        ) : (
                            orders.map((order, index) => (
                                <tr
                                    key={order.order_id}
                                    className="border-b hover:bg-gray-50"
                                >
                                    <td className="px-6 py-4">{index + 1}</td>
                                    <td className="px-6 py-4 font-medium text-gray-900">
                                        {order.resi_code}
                                    </td>
                                    <td className="px-6 py-4">
                                        {/* Jika ada join user, tampilkan nama. Jika tidak, ID user */}
                                        {order.user
                                            ? order.user.full_name
                                            : "User #" + order.user_id}
                                    </td>
                                    <td
                                        className="px-6 py-4 truncate max-w-xs"
                                        title={order.dropoff_address}
                                    >
                                        {order.dropoff_address}
                                    </td>
                                    <td className="px-6 py-4 font-semibold text-gray-700">
                                        {formatRupiah(order.total_harga)}
                                    </td>
                                    <td className="px-6 py-4">
                                        <span
                                            className={`px-2 py-1 rounded text-xs font-bold uppercase
                            ${order.status === "finding_driver" ? "bg-yellow-100 text-yellow-700" : ""}
                            ${order.status === "pickup" ? "bg-blue-100 text-blue-700" : ""}
                            ${order.status === "in_transit" ? "bg-purple-100 text-purple-700" : ""}
                            ${order.status === "delivered" ? "bg-green-100 text-green-700" : ""}
                            ${order.status === "cancelled" ? "bg-red-100 text-red-700" : ""}
                        `}
                                        >
                                            {order.status.replace("_", " ")}
                                        </span>
                                    </td>
                                    {/* ... di dalam map ... */}
                                    <td className="px-6 py-4">
                                        {/* Tombol Detail (User & Driver) */}
                                        <Link
                                            to={`/orders/${order.order_id}`}
                                            className="font-medium text-blue-600 hover:underline mr-3"
                                        >
                                            Detail
                                        </Link>

                                        {/* Tombol Finish (Khusus Driver & Status Pickup/Transit) */}
                                        {(order.status === "pickup" ||
                                            order.status === "in_transit") && (
                                            <button
                                                onClick={() => {
                                                    setSelectedOrderId(
                                                        order.order_id,
                                                    );
                                                    setIsUploadOpen(true);
                                                }}
                                                className="font-medium text-green-600 hover:underline"
                                            >
                                                Selesaikan
                                            </button>
                                        )}
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
            {/* MODAL UPLOAD BUKTI */}
            {isUploadOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded-lg shadow-xl w-96">
                        <h3 className="text-lg font-bold mb-4">
                            Upload Bukti Pengiriman 📸
                        </h3>
                        <form onSubmit={handleFinish}>
                            <div className="mb-4">
                                <input
                                    type="file"
                                    className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                                    onChange={(e) => setFile(e.target.files[0])}
                                    required
                                />
                            </div>
                            <div className="flex justify-end gap-2">
                                <button
                                    type="button"
                                    onClick={() => setIsUploadOpen(false)}
                                    className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded"
                                >
                                    Batal
                                </button>
                                <button
                                    type="submit"
                                    className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 flex items-center gap-2"
                                >
                                    <IoCloudUpload /> Kirim & Selesai
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </Layout>
    );
};

export default OrderList;
