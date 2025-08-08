const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();

// Importación de rutas
const authRoutes = require('./auth.routes');
const productosRoutes = require('./productos.routes');


app.use(cors());
app.use(express.json());

// Rutas principales
app.use('/api/auth', authRoutes);
app.use('/api', productosRoutes); // /api/productos
app.use('/api/correo', correoRoutes);

// Carpeta estática para imágenes subidas
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Puerto dinámico para Render o 3000 localmente
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
