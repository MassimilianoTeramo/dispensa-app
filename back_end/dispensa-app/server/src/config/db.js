const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

// Crea le tabelle se non esistono
const initDB = async () => {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS utenti (
      id SERIAL PRIMARY KEY,
      email VARCHAR UNIQUE NOT NULL,
      password_hash VARCHAR NOT NULL,
      created_at TIMESTAMP DEFAULT NOW()
    );

    CREATE TABLE IF NOT EXISTS prodotti (
      id SERIAL PRIMARY KEY,
      utente_id INTEGER REFERENCES utenti(id) ON DELETE CASCADE,
      nome VARCHAR NOT NULL,
      quantita INTEGER NOT NULL DEFAULT 0,
      unita VARCHAR DEFAULT 'pezzi',
      soglia_minima INTEGER DEFAULT 1,
      scadenza DATE,
      created_at TIMESTAMP DEFAULT NOW()
    );
  `);
  console.log('✅ Database pronto');
};

module.exports = { pool, initDB };