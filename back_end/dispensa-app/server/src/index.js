const express = require('express');
const cors = require('cors');
if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}

const { initDB } = require('./config/db');
const authRoutes = require('./routes/auth');
const prodottiRoutes = require('./routes/prodotti');

const app = express();

app.use(cors({
  origin: ['https://dispensa-app-rho.vercel.app', 'http://localhost:5173'],
  credentials: true,
}));
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/prodotti', prodottiRoutes);

// Gestione route non trovate
app.use((req, res) => {
  res.status(404).json({ error: 'Endpoint non trovato' });
});

// Gestione errori globale
app.use((err, req, res, next) => {
  console.error('❌ Errore non gestito:', err);
  res.status(500).json({ error: 'Errore interno del server' });
});

const PORT = process.env.PORT || 3001;

const start = async () => {
  await initDB();
  app.listen(PORT, () => console.log(`🚀 Server attivo su porta ${PORT}`));
};

start().catch((err) => console.error('❌ Errore avvio server:', err));