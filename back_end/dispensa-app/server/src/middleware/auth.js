const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1]; // Bearer <token>

  if (!token) {
    return res.status(401).json({ error: 'Token mancante' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.utente = decoded; // aggiunge { id, email } alla request
    next();
  } catch {
    res.status(401).json({ error: 'Token non valido' });
  }
};