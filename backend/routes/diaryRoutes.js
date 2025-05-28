// src/routes/DiaryRoute.js
import express from "express";
import { createNote, deleteNote, getNote, updateNote } from "../controllers/diaryController.js";
import { verifyToken } from "../middleware/authMiddleware.js";

const router = express.Router();

// Proteksi route dengan middleware verifyToken
router.get("/note", verifyToken, getNote);

router.post("/add-note", verifyToken, createNote);

router.put("/edit-note/:id", verifyToken, updateNote);

router.delete("/delete-note/:id", verifyToken, deleteNote);

export default router;
