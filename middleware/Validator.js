import { body, validationResult } from "express-validator";

export const validateCreateOrder = [
    // Cek Alamat
    body('pickup_address').notEmpty().withMessage('Alamat jemput wajib diisi'),
    body('dropoff_address').notEmpty().withMessage('Alamat tujuan wajib diisi'),
    
    // Cek Koordinat (Harus Angka Float)
    body('pickup_lat').isFloat().withMessage('Latitude jemput harus berupa angka desimal'),
    body('pickup_long').isFloat().withMessage('Longitude jemput harus berupa angka desimal'),
    body('dropoff_lat').isFloat().withMessage('Latitude tujuan harus berupa angka desimal'),
    body('dropoff_long').isFloat().withMessage('Longitude tujuan harus berupa angka desimal'),

    // Middleware penangkap error
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            // Jika ada error, stop & kirim pesan error pertama
            return res.status(400).json({ 
                msg: "Data tidak valid",
                errors: errors.array() 
            });
        }
        next(); // Lanjut ke Controller jika aman
    }
];