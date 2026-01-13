import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import axios from "axios";
import { IoLogOutOutline } from "react-icons/io5";

const Navbar = () => {
    const navigate = useNavigate();

    const logout = async () => {
        try {
            // Kita coba logout ke kedua endpoint (User & Driver) biar aman
            // Idealnya backend punya 1 endpoint logout umum, tapi ini cara cepatnya
            try {
                await axios.delete("http://localhost:5000/users/logout");
            } catch (e) {
                console.log("error : ", e);
            }
            try {
                await axios.delete("http://localhost:5000/drivers/logout");
            } catch (e) {
                console.log("error", e);
            }

            navigate("/");
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <nav className="fixed top-0 z-50 w-full bg-white border-b border-gray-200 shadow-sm">
            <div className="px-3 py-3 lg:px-5 lg:pl-3">
                <div className="flex items-center justify-between">
                    <div className="flex items-center justify-start">
                        <NavLink to="/dashboard" className="flex ml-2 md:mr-24">
                            <span className="self-center text-xl font-bold sm:text-2xl whitespace-nowrap text-blue-600">
                                LogiTrack 🚛
                            </span>
                        </NavLink>
                    </div>
                    <div className="flex items-center">
                        <button
                            onClick={logout}
                            className="flex items-center gap-2 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md text-sm transition"
                        >
                            Logout <IoLogOutOutline size={20} />
                        </button>
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
