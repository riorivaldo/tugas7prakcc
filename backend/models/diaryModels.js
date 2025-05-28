// src/models/DiaryModel.js
import { Sequelize } from "sequelize";
import db from "../config/database.js";

const { DataTypes } = Sequelize;

const Note = db.define("notes", {
  tanggal: DataTypes.DATE,
  isi: DataTypes.STRING,
});

db.sync().then(() => console.log("Database tersinkron"));

export default Note;
