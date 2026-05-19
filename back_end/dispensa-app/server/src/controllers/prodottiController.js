const { pool } = require('../config/db');

//get products
const getProdotti = async (req, res) => {
  const result = await pool.query(
    `SELECT p.*, 
      (SELECT json_agg(pr ORDER BY pr.prezzo ASC) 
       FROM prezzi pr WHERE pr.prodotto_id = p.id) as prezzi
     FROM prodotti p 
     WHERE p.utente_id = $1 
     ORDER BY p.nome`,
    [req.utente.id]
  );
  res.json(result.rows);
};

//Alert
const getAlert = async (req, res) => {
  const result = await pool.query(
    'SELECT * FROM prodotti WHERE utente_id = $1 AND quantita <= soglia_minima ORDER BY quantita',
    [req.utente.id]
  );
  res.json(result.rows);
};

//Post, put, delete
const creaProdotto = async (req, res) => {
  const { nome, categoria, quantita, unita, soglia_minima, scadenza } = req.body;

  if (!nome) return res.status(400).json({ error: 'Name is required' });
  if (quantita < 0) return res.status(400).json({ error: 'Quantity cannot be negative' });
  if (soglia_minima < 0) return res.status(400).json({ error: 'Minimum threshold cannot be negative' });

  const result = await pool.query(
    `INSERT INTO prodotti (utente_id, nome, categoria, quantita, unita, soglia_minima, scadenza)
     VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
    [req.utente.id, nome, categoria ?? 'Altro', quantita ?? 0, unita ?? 'pezzi', soglia_minima ?? 1, scadenza || null]
  );
  res.status(201).json(result.rows[0]);
};

const aggiornaProdotto = async (req, res) => {
  const { id } = req.params;
  const { nome, categoria, quantita, unita, soglia_minima, scadenza } = req.body;

  if (!nome) return res.status(400).json({ error: 'Name is required' });
  if (quantita < 0) return res.status(400).json({ error: 'Quantity cannot be negative' });
  if (soglia_minima < 0) return res.status(400).json({ error: 'Minimum threshold cannot be negative' });

  const result = await pool.query(
    `UPDATE prodotti SET nome=$1, categoria=$2, quantita=$3, unita=$4, soglia_minima=$5, scadenza=$6
     WHERE id=$7 AND utente_id=$8 RETURNING *`,
    [nome, categoria, quantita, unita, soglia_minima, scadenza || null, id, req.utente.id]
  );

  if (result.rows.length === 0)
    return res.status(404).json({ error: 'Product not found' });

  res.json(result.rows[0]);
};

const eliminaProdotto = async (req, res) => {
  const { id } = req.params;

  const result = await pool.query(
    'DELETE FROM prodotti WHERE id=$1 AND utente_id=$2 RETURNING id',
    [id, req.utente.id]
  );

  if (result.rows.length === 0)
    return res.status(404).json({ error: 'Product not found' });

  res.json({ messaggio: 'Prodotto eliminato' });
};

module.exports = { getProdotti, getAlert, creaProdotto, aggiornaProdotto, eliminaProdotto };