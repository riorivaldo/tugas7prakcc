// src/controllers/DiaryController.js
import Note from "../models/diaryModels.js";

// GET: Mengambil semua notes
async function getNote(req, res) {
    try {
      const result = await Note.findAll();
      res.status(200).json(result);  // Mengirim data dalam format JSON
    } catch (error) {
      console.error(error.message);
      res.status(500).json({ message: "Error fetching data from database." });
    }
  }
  
  // POST: Menambahkan note baru
  async function createNote(req, res) {
    try {
      const { tanggal, isi } = req.body;
      const newNote = await Note.create({ tanggal, isi });
      res.status(201).json(newNote);  // Mengirimkan data yang baru dibuat
    } catch (error) {
      console.error(error.message);
      res.status(500).json({ message: "Error creating note." });
    }
  }
  
  // PUT: Mengupdate note berdasarkan ID
  async function updateNote(req, res) {
    try {
      const { id } = req.params;
      const { tanggal, isi } = req.body;
      const note = await Note.findByPk(id);
  
      if (!note) {
        return res.status(404).json({ message: "Note not found" });
      }
  
      await Note.update({ tanggal, isi }, { where: { id } });
      res.status(200).json({ message: "Note updated successfully" });
    } catch (error) {
      console.error(error.message);
      res.status(500).json({ message: "Error updating note." });
    }
  }
  
  // DELETE: Menghapus note berdasarkan ID
  async function deleteNote(req, res) {
    try {
      const { id } = req.params;
      const note = await Note.findByPk(id);
  
      if (!note) {
        return res.status(404).json({ message: "Note not found" });
      }
  
      await Note.destroy({ where: { id } });
      res.status(200).json({ message: "Note deleted successfully" });
    } catch (error) {
      console.error(error.message);
      res.status(500).json({ message: "Error deleting note." });
    }
  }
  
  export { getNote, createNote, updateNote, deleteNote };
