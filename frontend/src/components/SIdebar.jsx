import React from "react";
import { NavLink } from "react-router-dom";
import { IoHome, IoPricetag, IoPerson, IoLogOut } from "react-icons/io5";
import { IoBicycle } from "react-icons/io5";

const Sidebar = () => {
    return (
        <aside className="fixed top-0 left-0 z-40 w-64 h-screen pt-20 transition-transform -translate-x-full bg-white border-r border-gray-200 sm:translate-x-0">
            <div className="h-full px-3 pb-4 overflow-y-auto bg-white">
                <ul className="space-y-2 font-medium">
                    <li>
                        <NavLink
                            to="/dashboard"
                            className={({ isActive }) =>
                                `flex items-center p-2 rounded-lg group ${
                                    isActive
                                        ? "bg-blue-100 text-blue-700"
                                        : "text-gray-900 hover:bg-gray-100"
                                }`
                            }
                        >
                            <IoHome className="text-xl text-gray-500 group-hover:text-blue-700" />
                            <span className="ml-3">Dashboard</span>
                        </NavLink>
                    </li>
                    <li>
                        <NavLink
                            to="/orders"
                            className={({ isActive }) =>
                                `flex items-center p-2 rounded-lg group ${
                                    isActive
                                        ? "bg-blue-100 text-blue-700"
                                        : "text-gray-900 hover:bg-gray-100"
                                }`
                            }
                        >
                            <IoPricetag className="text-xl text-gray-500 group-hover:text-blue-700" />
                            <span className="ml-3">Orders</span>
                        </NavLink>
                    </li>
                    <li>
                        {/* Contoh menu Users (Hanya Admin nanti) */}
                        <NavLink
                            to="/users"
                            className={({ isActive }) =>
                                `flex items-center p-2 rounded-lg group ${
                                    isActive
                                        ? "bg-blue-100 text-blue-700"
                                        : "text-gray-900 hover:bg-gray-100"
                                }`
                            }
                        >
                            <IoPerson className="text-xl text-gray-500 group-hover:text-blue-700" />
                            <span className="ml-3">Users</span>
                        </NavLink>
                    </li>
                    <li>
                        <NavLink
                            to="/drivers/market"
                            className={({ isActive }) =>
                                `flex items-center p-2 rounded-lg group ${isActive ? "bg-blue-100 text-blue-700" : "text-gray-900 hover:bg-gray-100"}`
                            }
                        >
                            <IoBicycle className="text-xl text-gray-500 group-hover:text-blue-700" />
                            <span className="ml-3">Bursa Order</span>
                        </NavLink>
                    </li>
                </ul>
            </div>
        </aside>
    );
};

export default Sidebar;
