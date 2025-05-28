import express from "express";
import { register, login } from "../controllers/AuthController.js";

const router = express.Router();

// Register user baru
router.post("/register", register);

// Login user
router.post("/login", login);

export default router;
