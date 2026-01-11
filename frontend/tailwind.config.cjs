/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        "./src/**/*.{js,jsx,ts,tsx}", // Sesuaikan ini agar Tailwind men-scan file React/HTML kamu
        "./public/index.html",
    ],
    theme: {
        extend: {},
    },
    plugins: [],
};
