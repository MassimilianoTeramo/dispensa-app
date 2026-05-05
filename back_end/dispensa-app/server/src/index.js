
const express = require('express');
const cors = require('cors');
if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}

const { initDB } = require('./config/db');
const authRoutes = require('./routes/auth');
const prodottiRoutes = require('./routes/prodotti');
require('./src/cronJobs');

const app = express();

app.set('trust proxy', 1); // fix rate-limit su Railway
app.use(express.json()); // assicura che req.body venga parsato
app.options('*', cors());
app.use(cors({
  origin: function(origin, callback) {
    const allowed = [
      'https://dispensa-app-rho.vercel.app',
      'http://localhost:5173'
    ];
    // accetta anche preview Vercel
    if (!origin || allowed.includes(origin) || origin.endsWith('.vercel.app')) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));

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