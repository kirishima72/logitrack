import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import Layout from "./Layout";
import { IoAdd } from "react-icons/io5";
import { formatRupiah } from "../features/CommonFunction";

const OrderList = () => {
    const [orders, setOrders] = React.useState([]);

    useEffect(() => {
        getOrders();
    }, []);

    const getOrders = async () => {
        try {
            const response = await axios.get("http://localhost:5000/orders/");
            // Backend mungkin me-return { data: [...] } atau langsung [...]
            // Sesuaikan dengan struktur JSON backend Anda.
            // Jika backend return { msg: "...", data: [...] }, gunakan response.data.data
            // Jika backend return [...] (array langsung), gunakan response.data
            setOrders(response.data);
        } catch (error) {
            console.log(error);
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
                                    <td className="px-6 py-4">
                                        <Link
                                            to={`/orders/${order.order_id}`}
                                            className="font-medium text-blue-600 hover:underline"
                                        >
                                            Detail
                                        </Link>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </Layout>
    );
};

export default OrderList;