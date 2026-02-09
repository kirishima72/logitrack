import React, { useEffect } from "react";
import Navbar from "./Navbar";
import Sidebar from "./SIdebar";
import io from "socket.io-client";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Layout = ({ children }) => {
    useEffect(() => {
        // 1. Koneksi ke Backend
        const socket = io("http://localhost:5000");

        // 2. Dengarkan event "order_taken" (Sesuai nama di Backend Controller)
        socket.on("order_taken", (data) => {
            // Tampilkan Notifikasi Suara/Pop-up
            toast.success(
                <div>
                    <strong>🔔 Driver Ditemukan!</strong>
                    <p className="text-sm">
                        Resi {data.resi} diambil oleh {data.driver_name}
                    </p>
                </div>,
            );
            // Opsional: Play Sound effect disini
        });

        // Cleanup saat component unmount (Logout/Tutup tab)
        return () => {
            socket.disconnect();
        };
    }, []);

    return (
        <React.Fragment>
            <Navbar />
            <div className="flex mt-16">
                {" "}
                {/* mt-16 untuk memberi jarak dari Navbar fixed */}
                <Sidebar />
                <main className="flex-1 p-8 sm:ml-64 bg-slate-50 min-h-screen">
                    {children}
                </main>
            </div>
            {/* Wadah Toast Notifikasi */}
            <ToastContainer position="top-right" autoClose={5000} />
        </React.Fragment>
    );
};

export default Layout;
