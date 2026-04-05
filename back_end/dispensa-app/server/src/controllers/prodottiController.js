const { pool } = require('../config/db');

// GET /api/prodotti
const getProdotti = async (req, res) => {
  const result = await pool.query(
    'SELECT * FROM prodotti WHERE utente_id = $1 ORDER BY nome',
    [req.utente.id]
  );
  res.json(result.rows);
};

// GET /api/alert (prodotti sotto soglia)
const getAlert = async (req, res) => {
  const result = await pool.query(
    'SELECT * FROM prodotti WHERE utente_id = $1 AND quantita <= soglia_minima ORDER BY quantita',
    [req.utente.id]
  );
  res.json(result.rows);
};

// POST /api/prodotti
const creaProdotto = async (req, res) => {
  const { nome, quantita, unita, soglia_minima, scadenza } = req.body;

  if (!nome) return res.status(400).json({ error: 'Nome obbligatorio' });

  const result = await pool.query(
    `INSERT INTO prodotti (utente_id, nome, quantita, unita, soglia_minima, scadenza)
     VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
    [req.utente.id, nome, quantita ?? 0, unita ?? 'pezzi', soglia_minima ?? 1, scadenza ?? null]
  );
  res.status(201).json(result.rows[0]);
};

// PUT /api/prodotti/:id
const aggiornaProdotto = async (req, res) => {
  const { id } = req.params;
  const { nome, quantita, unita, soglia_minima, scadenza } = req.body;

  const result = await pool.query(
    `UPDATE prodotti SET nome=$1, quantita=$2, unita=$3, soglia_minima=$4, scadenza=$5
     WHERE id=$6 AND utente_id=$7 RETURNING *`,
    [nome, quantita, unita, soglia_minima, scadenza, id, req.utente.id]
  );

  if (result.rows.length === 0)
    return res.status(404).json({ error: 'Prodotto non trovato' });

  res.json(result.rows[0]);
};

// DELETE /api/prodotti/:id
const eliminaProdotto = async (req, res) => {
  const { id } = req.params;

  const result = await pool.query(
    'DELETE FROM prodotti WHERE id=$1 AND utente_id=$2 RETURNING id',
    [id, req.utente.id]
  );

  if (result.rows.length === 0)
    return res.status(404).json({ error: 'Prodotto non trovato' });

  res.json({ messaggio: 'Prodotto eliminato' });
};

module.exports = { getProdotti, getAlert, creaProdotto, aggiornaProdotto, eliminaProdotto };