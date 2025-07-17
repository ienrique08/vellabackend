const express = require('express');
const cors = require('cors');
const app = express();
require('dotenv').config();


const authRoutes = require('./auth.routes');
const productosRoutes = require('./productos.routes'); // asegúrate que el nombre del archivo sea correcto

app.use(cors());
app.use(express.json());


// Rutas principales
app.use('/api/auth', authRoutes);
app.use('/api', productosRoutes); // << esta línea monta /api/productos
const path = require('path');
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.listen(3000, () => {
  console.log('Servidor corriendo en http://localhost:3000');

  const correoRoutes = require('./correo.routes');
app.use('/api/correo', correoRoutes);

});

