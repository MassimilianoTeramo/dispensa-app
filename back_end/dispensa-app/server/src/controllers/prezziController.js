const { pool } = require('../config/db');

// GET /api/prodotti/:id/prezzi
const getPrezzi = async (req, res) => {
  const { id } = req.params;
  const result = await pool.query(
    'SELECT * FROM prezzi WHERE prodotto_id = $1 ORDER BY prezzo ASC',
    [id]
  );
  res.json(result.rows);
};

// POST /api/prodotti/:id/prezzi
const aggiungiPrezzo = async (req, res) => {
  const { id } = req.params;
  const { supermercato, prezzo } = req.body;

  if (!supermercato || !prezzo)
    return res.status(400).json({ error: 'Supermercato e prezzo obbligatori' });

  // Se esiste già un prezzo per questo supermercato, aggiornalo
  const esistente = await pool.query(
    'SELECT id FROM prezzi WHERE prodotto_id = $1 AND supermercato = $2',
    [id, supermercato]
  );

  let result;
  if (esistente.rows.length > 0) {
    result = await pool.query(
      'UPDATE prezzi SET prezzo = $1, aggiornato_il = NOW() WHERE id = $2 RETURNING *',
      [prezzo, esistente.rows[0].id]
    );
  } else {
    result = await pool.query(
      'INSERT INTO prezzi (prodotto_id, supermercato, prezzo) VALUES ($1, $2, $3) RETURNING *',
      [id, supermercato, prezzo]
    );
  }

  res.status(201).json(result.rows[0]);
};

// DELETE /api/prodotti/:prodottoId/prezzi/:prezzoId
const eliminaPrezzo = async (req, res) => {
  const { prezzoId } = req.params;
  await pool.query('DELETE FROM prezzi WHERE id = $1', [prezzoId]);
  res.json({ messaggio: 'Prezzo eliminato' });
};

module.exports = { getPrezzi, aggiungiPrezzo, eliminaPrezzo };