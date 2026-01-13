import React, { useState, useEffect } from "react";
import Layout from "./Layout";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
    const [name, setName] = useState("");
    const [role, setRole] = useState("");
    const navigate = useNavigate();

    const getMe = async () => {
        try {
            // Kita coba cek apakah dia User/Admin?
            try {
                const response = await axios.get(
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
            const responseDriver = await axios.get(
                "http://localhost:5000/driver/me"
            );
            setName(responseDriver.data.driver_name);
            setRole("driver");
        } catch (error) {
            console.log("error : ", error);
            // Jika User & Driver gagal, tendang ke login
            navigate("/");
        }
    };

    useEffect(() => {
        getMe();
    }, []);

    return (
        <Layout>
            <div className="mb-6">
                <h1 className="text-3xl font-bold text-gray-800">Dashboard</h1>
                <h2 className="text-xl text-gray-600">
                    Selamat Datang Kembali,{" "}
                    <strong className="text-blue-600">{name}</strong>
                </h2>
            </div>

            {/* Konten Dummy Dulu */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-blue-500">
                    <h3 className="text-gray-500 text-sm font-medium">
                        Role Anda
                    </h3>
                    <p className="text-2xl font-bold text-gray-800 uppercase">
                        {role}
                    </p>
                </div>
                {/* Nanti kita isi widget statistik disini */}
            </div>
        </Layout>
    );
};

export default Dashboard;
