const express = require('express');
const router = express.Router();
const rateLimit = require('express-rate-limit');
const { register, login, demoLogin } = require('../controllers/authController');

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minuti
  max: 10, // max 10 tentativi
  message: { error: 'Troppi tentativi, riprova tra 15 minuti' },
});

//router.post('/register', authLimiter, register);
router.post('/login', authLimiter, login);
router.post('/demo', demoLogin);
module.exports = router;