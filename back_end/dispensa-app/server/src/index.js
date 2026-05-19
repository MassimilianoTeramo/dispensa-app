
const express = require('express');
const cors = require('cors');
if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}

const { initDB } = require('./config/db');
const authRoutes = require('./routes/auth');
const prodottiRoutes = require('./routes/prodotti');
require('./cronJobs');
const { resetDemoData } = require('./cronJobs');
const app = express();

app.set('trust proxy', 1); // fix rate-limit su Railway
app.use(express.json()); // to parse JSON bodies
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
  res.status(404).json({ error: 'Endpoint not found' });
});

// Gestione errori globale
app.use((err, req, res, next) => {
  console.error('❌ Error:', err);
  res.status(500).json({ error: 'Server error' });
});

const PORT = process.env.PORT || 3001;

const start = async () => {
  await initDB();
  app.listen(PORT, () => console.log(` Server active on port ${PORT}`));
};


start().then(() => {
  resetDemoData(); // test immediato
}).catch((err) => console.error('❌ Error starting server:', err));