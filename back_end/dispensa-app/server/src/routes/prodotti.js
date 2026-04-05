const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const {
  getProdotti, getAlert, creaProdotto, aggiornaProdotto, eliminaProdotto
} = require('../controllers/prodottiController');

router.use(auth); // tutte le route qui sotto richiedono autenticazione

router.get('/', getProdotti);
router.get('/alert', getAlert);
router.post('/', creaProdotto);
router.put('/:id', aggiornaProdotto);
router.delete('/:id', eliminaProdotto);

module.exports = router;