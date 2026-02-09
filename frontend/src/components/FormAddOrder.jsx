import Layout from "./Layout";
import api from "../config/axios";
import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

const pickupIcon = new L.Icon({
    iconUrl:
        "/public/pointer.png",
    shadowUrl:
        "https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png",
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41],
});

const dropoffIcon = new L.Icon({
    iconUrl:
        "/public/pointer.png",
    shadowUrl:
        "https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png",
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41],
});

const FormAddOrder = () => {
    const [pickupAddr, setPickupAddr] = useState("");
    const [dropoffAddr, setDropoffAddr] = useState("");
    const [itemDetail, setItemDetail] = useState("");
    const [berat, setBerat] = useState(1);

    const [msg, setMsg] = useState("");

    // Default Koordinat (Misal: Monas, Jakarta)
    const [pickupPos, setPickupPos] = useState({
        lat: -6.175392,
        lng: 106.827153,
    });
    const [dropoffPos, setDropoffPos] = useState({
        lat: -6.194957,
        lng: 106.823028,
    });

    const navigate = useNavigate();

    // --- KOMPONEN DRAGGABLE MARKER (VERSI FIX) ---
    function DraggableMarker({ position, setPosition, icon, label }) {
        // Gunakan useMemo agar event handler tidak di-render ulang terus menerus
        const eventHandlers = useMemo(
            () => ({
                dragend(e) {
                    // CARA BARU: Pakai e.target, bukan ref
                    const marker = e.target;
                    if (marker != null) {
                        setPosition(marker.getLatLng());
                    }
                },
            }),
            [setPosition], // Dependency
        );

        return (
            <Marker
                draggable={true}
                eventHandlers={eventHandlers}
                position={position}
                icon={icon}
            >
                <Popup minWidth={90}>
                    <span>{label}</span>
                </Popup>
            </Marker>
        );
    }

    // --- SUBMIT DATA KE BACKEND ---
    const saveOrder = async (e) => {
        e.preventDefault();
        try {
            await api.post("http://localhost:5000/orders", {
                pickup_address: pickupAddr,
                dropoff_address: dropoffAddr,
                pickup_lat: pickupPos.lat,
                pickup_long: pickupPos.lng,
                dropoff_lat: dropoffPos.lat,
                dropoff_long: dropoffPos.lng,
                jenis_paket: itemDetail,
                berat_paket_kg: berat,
            });
            navigate("/orders");
        } catch (error) {
            if (error.response) {
                setMsg(error.response.data.msg);
            }
        }
    };

    return (
        <Layout>
            <h1 className="text-3xl font-bold text-gray-800 mb-6">
                Buat Pesanan Baru
            </h1>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* --- KOLOM KIRI: FORM --- */}
                <div className="bg-white p-6 rounded-lg shadow-md h-fit">
                    <h2 className="text-xl font-semibold mb-4 text-blue-600">
                        Detail Pengiriman
                    </h2>
                    <form onSubmit={saveOrder}>
                        {msg && (
                            <p className="text-center bg-red-100 text-red-700 p-2 rounded mb-4">
                                {msg}
                            </p>
                        )}

                        {/* Pickup */}
                        <div className="mb-4">
                            <label className="block text-gray-700 text-sm font-bold mb-2">
                                Alamat Jemput (Pickup)
                            </label>
                            <input
                                type="text"
                                className="w-full border p-2 rounded"
                                value={pickupAddr}
                                onChange={(e) => setPickupAddr(e.target.value)}
                                placeholder="Contoh: Jl. Sudirman No. 1..."
                                required
                            />
                            <p className="text-xs text-green-600 mt-1">
                                📍 Koordinat: {pickupPos.lat.toFixed(4)},{" "}
                                {pickupPos.lng.toFixed(4)}
                            </p>
                        </div>

                        {/* Dropoff */}
                        <div className="mb-4">
                            <label className="block text-gray-700 text-sm font-bold mb-2">
                                Alamat Tujuan (Dropoff)
                            </label>
                            <input
                                type="text"
                                className="w-full border p-2 rounded"
                                value={dropoffAddr}
                                onChange={(e) => setDropoffAddr(e.target.value)}
                                placeholder="Contoh: Mall Grand Indonesia..."
                                required
                            />
                            <p className="text-xs text-red-600 mt-1">
                                📍 Koordinat: {dropoffPos.lat.toFixed(4)},{" "}
                                {dropoffPos.lng.toFixed(4)}
                            </p>
                        </div>

                        {/* Item */}
                        <div className="mb-6">
                            <label className="block text-gray-700 text-sm font-bold mb-2">
                                Detail Barang
                            </label>
                            <textarea
                                className="w-full border p-2 rounded"
                                value={itemDetail}
                                onChange={(e) => setItemDetail(e.target.value)}
                                placeholder="Contoh: Dokumen penting dalam amplop coklat..."
                                required
                            />
                        </div>

                        {/* Berat Item */}
                        <div className="mb-6">
                            <label className="block text-gray-700 text-sm font-bold mb-2">
                                Berat Barang
                            </label>
                            <input
                                type="text"
                                className="w-full border p-2 rounded"
                                value={berat}
                                onChange={(e) => setBerat(e.target.value)}
                                placeholder="Contoh: 25"
                                required
                            />
                        </div>

                        <button
                            type="submit"
                            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded transition"
                        >
                            Hitung Harga & Pesan Sekarang 🚀
                        </button>
                    </form>
                </div>

                {/* --- KOLOM KANAN: PETA --- */}
                <div className="bg-white p-4 rounded-lg shadow-md h-125 z-0">
                    <h2 className="text-sm text-gray-500 mb-2">
                        👇 Geser Pin Hijau (Jemput) & Merah (Tujuan) untuk
                        akurasi harga
                    </h2>

                    <MapContainer
                        center={[-6.175392, 106.827153]}
                        zoom={13}
                        scrollWheelZoom={true}
                        style={{
                            height: "100%",
                            width: "100%",
                            borderRadius: "8px",
                        }}
                    >
                        <TileLayer
                            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        />

                        {/* Marker Hijau (Pickup) */}
                        <DraggableMarker
                            position={pickupPos}
                            setPosition={setPickupPos}
                            icon={pickupIcon}
                            label="Lokasi Jemput"
                        />

                        {/* Marker Merah (Dropoff) */}
                        <DraggableMarker
                            position={dropoffPos}
                            setPosition={setDropoffPos}
                            icon={dropoffIcon}
                            label="Lokasi Tujuan"
                        />
                    </MapContainer>
                </div>
            </div>
        </Layout>
    );
};

export default FormAddOrder;
