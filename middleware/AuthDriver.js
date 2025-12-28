import Driver from "../models/DriverModel.js";

export const verifyDriver = async (req, res, next) => {
    if (!req.session.driverId) {
        return res.status(401).json({ msg: "Mohon login sebagai Driver!" });
    }

    const driver = await Driver.findOne({
        where: {
            driver_id: req.session.driverId,
        },
    });

    if (!driver) return res.status(404).json({ msg: "Driver tidak ditemukan" });

    if (!driver.is_active)
        return res.status(403).json({ msg: "Akun Driver Anda belum aktif." });

    req.driverId = driver.driver_id;
    next();

};
