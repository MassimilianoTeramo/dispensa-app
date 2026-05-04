const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const {
  getProdotti, getAlert, creaProdotto, aggiornaProdotto, eliminaProdotto
} = require('../controllers/prodottiController');
const {
  getPrezzi, aggiungiPrezzo, eliminaPrezzo
} = require('../controllers/prezziController');

router.use(auth); //roots authentication constrol 

router.get('/', getProdotti);
router.get('/alert', getAlert);
router.post('/', creaProdotto);
router.put('/:id', aggiornaProdotto);
router.delete('/:id', eliminaProdotto);

// Price
router.get('/:id/prezzi', getPrezzi);
router.post('/:id/prezzi', aggiungiPrezzo);
router.delete('/:prodottoId/prezzi/:prezzoId', eliminaPrezzo);

module.exports = router;