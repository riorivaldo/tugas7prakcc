// src/index.js
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import NoteRoute from "./routes/diaryRoutes.js";  // Mengimpor routes Diary
import AuthRoute from "./routes/AuthRoute.js";    // Mengimpor routes Auth

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

// Route autentikasi (register & login)
app.use("/auth", AuthRoute);

// Route diary
app.use(NoteRoute);

// Memulai server
app.listen(5000, () => console.log("Server is running on port 5000"));
