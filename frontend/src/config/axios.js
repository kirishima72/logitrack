import axios from "axios";

// Ambil URL dari file .env
const baseURL = import.meta.env.VITE_API_BASE_URL;

const api = axios.create({
    baseURL: baseURL,
    withCredentials: true, // Wajib agar session/cookie terbawa
});

// --- INTERCEPTOR (SATPOL PP) ---
// Fitur Pro: Jika Backend menolak (401 Unauthorized), otomatis tendang ke Login
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response && error.response.status === 401) {
            // Jika user maksa masuk tanpa login, atau session habis
            // Kita bisa redirect manual atau biarkan error handling component yang kerja
            // window.location.href = "/"; // Uncomment jika ingin auto-kick keras
        }
        return Promise.reject(error);
    },
);

export default api;
