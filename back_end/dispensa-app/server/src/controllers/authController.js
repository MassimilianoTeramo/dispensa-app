const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { pool } = require('../config/db');

// POST /api/auth/register
const register = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password)
    return res.status(400).json({ error: 'Email e password obbligatorie' });

  try {
    const passwordHash = await bcrypt.hash(password, 10);
    const result = await pool.query(
      'INSERT INTO utenti (email, password_hash) VALUES ($1, $2) RETURNING id, email',
      [email, passwordHash]
    );
    res.status(201).json({ utente: result.rows[0] });
  } catch (err) {
    if (err.code === '23505') // unique violation
      return res.status(409).json({ error: 'Email già registrata' });
    res.status(500).json({ error: 'Errore del server' });
  }
};

// POST /api/auth/login
const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const result = await pool.query('SELECT * FROM utenti WHERE email = $1', [email]);
    const utente = result.rows[0];

    if (!utente || !(await bcrypt.compare(password, utente.password_hash)))
      return res.status(401).json({ error: 'Credenziali non valide' });

    const token = jwt.sign(
      { id: utente.id, email: utente.email },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({ token });
  } catch {
    res.status(500).json({ error: 'Errore del server' });
  }
};

// POST /api/auth/demo
const demoLogin = async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM utenti WHERE email = $1', ['demo@user.app']);
    const utente = result.rows[0];

    if (!utente) {
      return res.status(404).json({ error: 'Utente demo non trovato' });
    }

    const token = jwt.sign(
      { id: utente.id, email: utente.email },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.json({ token });
  } catch (err) {
    res.status(500).json({ error: 'Errore del server' });
  }
};

module.exports = { register, login, demoLogin };