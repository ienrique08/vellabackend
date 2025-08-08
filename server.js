const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();

app.use(cors({
  origin: 'https://vella-vita.netlify.app' // Cambia por tu URL frontend
}));

app.use(express.json());

const connection = require('./db');

app.get('/api/productos', async (req, res) => {
  try {
    const [rows] = await connection.query('SELECT * FROM productos');
    res.json(rows);
  } catch (err) {
    console.error('Error al obtener productos:', err);
    res.status(500).json({ error: 'Error al obtener productos' });
  }
});

// Aquí el resto de tus rutas...

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
