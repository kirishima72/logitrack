import React from "react";
import Navbar from "./Navbar";
import Sidebar from "./SIdebar";

const Layout = ({ children }) => {
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
        </React.Fragment>
    );
};

export default Layout;
