import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom"; // Untuk pindah halaman

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [role, setRole] = useState("user"); // Default: user (customer/admin)
    const [msg, setMsg] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const navigate = useNavigate();

    const Auth = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setMsg("");

        try {
            // Tentukan endpoint berdasarkan role yang dipilih
            const endpoint =
                role === "driver"
                    ? "http://localhost:5000/drivers/login"
                    : "http://localhost:5000/users/login";

            await axios.post(endpoint, {
                email: email,
                password: password,
            });

            // Jika sukses, arahkan ke dashboard
            // (Nanti kita bedakan dashboard driver vs user)
            navigate("/dashboard");
        } catch (error) {
            if (error.response) {
                setMsg(error.response.data.msg);
            } else {
                setMsg("Tidak dapat terhubung ke server");
            }
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <section className="hero has-background-grey-light is-fullheight is-fullwidth">
            <div className="min-h-screen bg-slate-100 flex items-center justify-center p-4">
                <div className="bg-white shadow-xl rounded-lg overflow-hidden w-full max-w-md">
                    {/* Header & Tabs */}
                    <div className="bg-blue-600 p-6 text-center">
                        <h1 className="text-2xl font-bold text-white mb-4">
                            LogiTrack Login
                        </h1>

                        {/* Role Switcher */}
                        <div className="flex bg-blue-800 rounded-lg p-1">
                            <button
                                onClick={() => setRole("user")}
                                className={`flex-1 py-2 text-sm font-medium rounded-md transition-colors ${
                                    role === "user"
                                        ? "bg-white text-blue-800 shadow"
                                        : "text-blue-200 hover:text-white"
                                }`}
                            >
                                Customer / Admin
                            </button>
                            <button
                                onClick={() => setRole("driver")}
                                className={`flex-1 py-2 text-sm font-medium rounded-md transition-colors ${
                                    role === "driver"
                                        ? "bg-white text-blue-800 shadow"
                                        : "text-blue-200 hover:text-white"
                                }`}
                            >
                                Driver Mitra
                            </button>
                        </div>
                    </div>

                    {/* Form */}
                    <div className="p-8">
                        <form onSubmit={Auth}>
                            {msg && (
                                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4 text-sm text-center">
                                    {msg}
                                </div>
                            )}

                            <div className="mb-4">
                                <label className="block text-gray-700 text-sm font-bold mb-2">
                                    Email
                                </label>
                                <input
                                    type="email"
                                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="Email Anda..."
                                    required
                                />
                            </div>

                            <div className="mb-6">
                                <label className="block text-gray-700 text-sm font-bold mb-2">
                                    Password
                                </label>
                                <input
                                    type="password"
                                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    value={password}
                                    onChange={(e) =>
                                        setPassword(e.target.value)
                                    }
                                    placeholder="******"
                                    required
                                />
                            </div>

                            <button
                                type="submit"
                                className="w-full bg-blue-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-blue-700 transition duration-300 shadow-lg disabled:bg-gray-400"
                                disabled={isLoading}
                            >
                                {isLoading
                                    ? "Memproses..."
                                    : role === "driver"
                                    ? "Masuk sebagai Driver"
                                    : "Masuk"}
                            </button>
                        </form>
                    </div>

                    <div className="bg-gray-50 px-8 py-4 text-center text-xs text-gray-500">
                        LogiTrack System v1.0
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Login;
