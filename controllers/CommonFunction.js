export const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371; // Radius of the Earth in kilometers
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLon = ((lon2 - lon1) * Math.PI) / 180;

    // Yang ini dari referensi github
    // const a =
    //     Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    //     Math.cos((lat1 * Math.PI) / 180) *
    //         Math.cos((lat2 * Math.PI) / 180) *
    //         Math.sin(dLon / 2) *
    //         Math.sin(dLon / 2);

    // Yang ini referensi dari Gemini
    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(lat1 * (Math.PI / 180)) *
            Math.cos(lat2 * (Math.PI / 180)) *
            Math.sin(dLon / 2) *
            Math.sin(dLon / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c; // Distance in kilometers
};

export const calculatePrice = (distanceKm) => {
    const HARGA_DASAR = 10000; // Harga dasar per kilometer
    const HARGA_PER_KM = 2000; // Harga tambahan per kilometer

    // Pembulatan jarak ke atas (misal 2.1 km dianggap 3 km) biar untung dikit
    const roundedDistance = Math.ceil(distanceKm);

    return HARGA_DASAR + (roundedDistance * HARGA_PER_KM);
};
