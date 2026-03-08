const db = require('../config/database');

function initDatabase() {
  db.exec(`
    CREATE TABLE IF NOT EXISTS "Order" (
      orderId     TEXT PRIMARY KEY,
      value       REAL NOT NULL,
      creationDate TEXT NOT NULL
    );
  `);

  db.exec(`
    CREATE TABLE IF NOT EXISTS Items (
      id          INTEGER PRIMARY KEY AUTOINCREMENT,
      orderId     TEXT    NOT NULL,
      productId   INTEGER NOT NULL,
      quantity    INTEGER NOT NULL,
      price       REAL    NOT NULL,
      FOREIGN KEY (orderId) REFERENCES "Order"(orderId) ON DELETE CASCADE
    );
  `);

  console.log('Banco de dados inicializado com sucesso!');
}

module.exports = { initDatabase };