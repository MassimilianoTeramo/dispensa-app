const cron = require('node-cron');
const pool = require('./db'); // adatta il path al file db
const demoData = require('../demoData.json');

const resetDemoData = async () => {
  try {
    console.log('Reset demo data started...');

    // 1. Delete demo data
    await pool.query('DELETE FROM prodotti WHERE utente_id = $1', [2]);

    // 2. re-insert demo data
    for (const prodotto of demoData) {
      const result = await pool.query(
        `INSERT INTO prodotti (utente_id, nome, categoria, quantita, unita, soglia_minima, scadenza)
         VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING id`,
        [prodotto.utente_id, prodotto.nome, prodotto.categoria, prodotto.quantita, prodotto.unita, prodotto.soglia_minima, prodotto.scadenza]
      );

      const prodottoId = result.rows[0].id;

      for (const prezzo of prodotto.prezzi) {
        await pool.query(
          `INSERT INTO prezzi (prodotto_id, supermercato, prezzo)
           VALUES ($1, $2, $3)`,
          [prodottoId, prezzo.supermercato, prezzo.prezzo]
        );
      }
    }

    console.log('Reset demo completato!');
  } catch (err) {
    console.error('Errore reset demo:', err);
  }
};

// Esegui ogni notte alle 3:00
cron.schedule('0 3 * * *', resetDemoData);

// Esporta per poterlo chiamare manualmente se necessario
module.exports = { resetDemoData };