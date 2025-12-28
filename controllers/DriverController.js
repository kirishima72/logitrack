import Driver from "../models/DriverModel.js";
import argon2 from "argon2";

export const getDrivers = async (req, res) => {
    try {
        const response = await Driver.findAll({
            attributes: [
                "driver_id",
                "driver_name",
                "phone_number",
                "email",
                "vehicle",
                "vehicle_number",
                "is_active",
            ],
        });
        res.status(200).json(response);
    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
};

export const registerDriver = async (req, res) => {
    const {
        driver_name,
        email,
        password,
        confPassword,
        phone_number,
        vehicle,
        vehicle_number,
    } = req.body;

    if (password !== confPassword)
        return res
            .status(400)
            .json({ msg: "Password dan Confirm Password tidak cocok" });

    const hash = await argon2.hash(password);

    try {
        await Driver.create({
            driver_name: driver_name,
            email: email,
            password_hash: hash,
            phone_number: phone_number,
            vehicle: vehicle,
            vehicle_number: vehicle_number,
        });
        res.status(201).json({ msg: "Register Driver Berhasil" });
    } catch (error) {
        res.status(400).json({ msg: error.message });
    }
};

export const loginDriver = async (req, res) => {
    const { email, password } = req.body;

    try {
        const findDriver = await Driver.findOne({
            where: { email: email },
        });

        if (!findDriver)
            return res.status(404).json({ msg: "Driver tidak ditemukan" });

        const match = await argon2.verify(findDriver.password_hash, password);

        if (!match) return res.status(400).json({ msg: "Password salah" });

        if (!findDriver.is_active) {
            return res.status(403).json({
                msg: "Akun Anda belum diaktifkan oleh Admin. Silakan hubungi kantor.",
            });
        }

        req.session.driverId = findDriver.driver_id;

        const id = findDriver.driver_id;
        const driver_name = findDriver.driver_name;
        const vehicle = findDriver.vehicle;
        const vehicle_number = findDriver.vehicle_number;
        const available = findDriver.is_active;

        res.status(200).json({
            msg: "Login Berhasil",
            data: {
                driver_id: id,
                driver_name: driver_name,
                email: email,
                vehicle: vehicle,
                vehicle_number: vehicle_number,
                active: available,
            },
        });
    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
};

export const getCurrentDriver = async (req, res) => {
    if (!req.session.driverId) {
        return res.status(401).json({ msg: "Mohon login ke akun Anda!" });
    }

    const driver = await Driver.findOne({
        attributes: [
            "driver_id",
            "driver_name",
            "email",
            "phone_number",
            "vehicle",
            "vehicle_number",
            "is_active",
        ],
        where: {
            driver_id: req.session.driverId,
        },
    });
    if (!driver) return res.status(404).json({ msg: "Driver tidak ditemukan" });
    res.status(200).json(driver);
};

export const logOutDriver = async (req, res) => {
    req.session.destroy((err) => {
        if (err) return res.status(500).json({ msg: "Gagal logout" });
        res.status(200).json({ msg: "Logout berhasil" });
    });
};
