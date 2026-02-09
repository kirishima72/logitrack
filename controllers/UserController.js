import User from "../models/UserModel.js";
import Driver from "../models/DriverModel.js";
import argon2 from "argon2";

export const getUsers = async (req, res) => {
    try {
        const response = await User.findAll({
            attributes: ["user_id", "full_name", "email", "role"],
        });
        res.status(200).json(response);
    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
};

export const register = async (req, res) => {
    // 1. Ambil data dari body request
    const { full_name, email, password, confPassword, role } = req.body;

    // 2. Validasi Password & Confirm Password
    if (password !== confPassword)
        return res
            .status(400)
            .json({ msg: "Password dan Confirm Password tidak cocok" });

    // 3. Hashing Password (Keamanan Tingkat Tinggi)
    const hash = await argon2.hash(password);

    // 4. Masukkan ke Database
    try {
        await User.create({
            full_name: full_name,
            email: email,
            password_hash: hash, // Simpan yang sudah di-hash!
            role: role || "customer", // Default customer
        });
        res.status(201).json({ msg: "Register Berhasil" });
    } catch (error) {
        // Handle error duplikat email dll
        res.status(400).json({ msg: error.message });
    }
};

export const login = async (req, res) => {
    const { email, password } = req.body;

    try {
        //1. Cari user berdasarkan email
        const findUser = await User.findOne({
            where: { email: email },
        });

        //2. Jika user tidak ditemukan, maka error
        if (!findUser)
            return res.status(404).json({ msg: "User tidak ditemukan" });

        //3. Jika user ditemukan, verifikasi password
        const match = await argon2.verify(findUser.password_hash, password);

        //4. Jika password salah, maka error
        if (!match) return res.status(400).json({ msg: "Password salah" });

        req.session.userId = findUser.user_id;

        //5 Filter data hasil login
        const id = findUser.user_id;
        const name = findUser.full_name;
        const role = findUser.role;

        res.status(200).json({
            msg: "Login Berhasil",
            data: {
                user_Id: id,
                full_name: name,
                email: email,
                role: role,
            },
        });
    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
};

export const getCurrentUser = async (req, res) => {
    if (!req.session.userId) {
        return res.status(401).json({ msg: "Mohon login ke akun Anda!" });
    }
    const user = await User.findOne({
        attributes: ["user_id", "full_name", "email", "role"], // Password jangan dikirim!
        where: {
            user_id: req.session.userId,
        },
    });
    if (!user) return res.status(404).json({ msg: "User tidak ditemukan" });
    res.status(200).json(user);
};

export const getCurrentLogin = async (req, res) => {
    if (req.session.userId) {
        const user = await User.findOne({
            attributes: ["full_name", "role"],
            where: { user_id: req.session.userId },
        });
        return res.status(200).json({ name: user.full_name, role: user.role });
    }

    if (req.session.driverId) {
        const driver = await Driver.findOne({
            attributes: ["driver_name"],
            where: { driver_id: req.session.driverId },
        });
        return res.status(200).json({
            name: driver.driver_name,
            role: "driver",
        });
    }

    return res.status(401).json({ msg: "Mohon login ke akun Anda" });
};

export const activateDriver = async (req, res) => {
    try {
        const drivers = await Driver.findOne({
            where: {
                driver_id: req.body.driverId,
            },
        });

        if (!drivers) {
            return res.status(404).json({ msg: "Driver tidak ditemukan" });
        }

        await Driver.update(
            { is_active: true },
            { where: { driver_id: req.body.driverId } },
        );

        res.status(200).json({ msg: "Driver berhasil diaktifkan" });
    } catch (error) {
        res.status(500).json({
            msg: "Terjadi kesalahan saat mengaktifkan driver",
        });
    }
};

export const logOut = (req, res) => {
    req.session.destroy((err) => {
        if (err) return res.status(400).json({ msg: "Tidak dapat logout" });
        res.status(200).json({ msg: "Anda telah logout" });
    });
};
