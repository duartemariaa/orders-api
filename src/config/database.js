const Database = require('better-sqlite3');
const path = require('path');
require('dotenv').config();

const dbPath = path.resolve(process.env.DB_PATH || './database.sqlite'); // Caminho do arquivo do banco de dados

const db = new Database(dbPath); // Cria (ou abre) o banco de dados

db.pragma('foreign_keys = ON'); // Habilita chaves estrangeiras (FK) para garantir integridade referencial

module.exports = db;