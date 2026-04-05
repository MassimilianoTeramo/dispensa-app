const express = require('express');
const cors = require('cors');
require('dotenv').config();

const { initDB } = require('./config/db');
const authRoutes = require('./routes/auth');
const prodottiRoutes = require('./routes/prodotti');

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/prodotti', prodottiRoutes);

const PORT = process.env.PORT || 5000;

initDB().then(() => {
  app.listen(PORT, () => console.log(`🚀 Server attivo su porta ${PORT}`));
}).catch((err) => {
  console.error('❌ Errore avvio server:', err);
});