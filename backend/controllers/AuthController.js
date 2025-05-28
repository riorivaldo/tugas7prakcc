import User from "../models/UserModel.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

// Register user baru
export const register = async (req, res) => {
  const { username, password } = req.body;

  try {
    // Cek apakah username sudah ada
    const userExist = await User.findOne({
      where: { username },
    });
    if (userExist)
      return res.status(400).json({ msg: "Username sudah terdaftar" });

    // Hash password
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(password, salt);

    // Simpan user baru
    await User.create({
      username,
      password: hashedPassword,
    });

    res.status(201).json({ msg: "User berhasil didaftarkan" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Server error saat register" });
  }
};

// Login user
export const login = async (req, res) => {
  const { username, password } = req.body;

  try {
    // Cari user berdasarkan username
    const user = await User.findOne({ where: { username } });
    if (!user) return res.status(404).json({ msg: "User tidak ditemukan" });

    // Cek password
    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(400).json({ msg: "Password salah" });

    // Generate JWT
    const token = jwt.sign(
      { id: user.id, username: user.username },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN }
    );

    res.status(200).json({
      msg: "Login berhasil",
      token,
      user: {
        id: user.id,
        username: user.username,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Server error saat login" });
  }
};
