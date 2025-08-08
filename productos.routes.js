const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const db = require('./db'); // Asegúrate que este archivo tenga la conexión MySQL

// Configuración para guardar imágenes
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  }
});
const upload = multer({ storage });

// ============================
// Obtener todos los productos
// ============================
router.get('/productos', async (req, res) => {
  try {
    const [result] = await db.query('SELECT * FROM productos');
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener productos' });
  }
});

// ============================
// Obtener un producto por ID
// ============================
router.get('/productos/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const [result] = await db.query('SELECT * FROM productos WHERE id = ?', [id]);
    if (result.length === 0) {
      return res.status(404).json({ mensaje: 'Producto no encontrado' });
    }
    res.json(result[0]);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener el producto' });
  }
});

// ============================
// Agregar un nuevo producto
// ============================
router.post('/productos', upload.single('imagen'), async (req, res) => {
  const { nombre, descripcion, precio } = req.body;
  const imagen = req.file ? req.file.filename : null;

  try {
    await db.query(
      'INSERT INTO productos (nombre, descripcion, precio, imagen) VALUES (?, ?, ?, ?)',
      [nombre, descripcion, precio, imagen]
    );
    res.status(201).json({ mensaje: 'Producto agregado correctamente' });
  } catch (error) {
    res.status(500).json({ error: 'Error al agregar producto' });
  }
});

// ============================
// Editar producto
// ============================
router.put('/productos/:id', upload.single('imagen'), async (req, res) => {
  const { id } = req.params;
  const { nombre, descripcion, precio } = req.body;
  const imagen = req.file ? req.file.filename : null;

  try {
    if (imagen) {
      await db.query(
        'UPDATE productos SET nombre = ?, descripcion = ?, precio = ?, imagen = ? WHERE id = ?',
        [nombre, descripcion, precio, imagen, id]
      );
    } else {
      await db.query(
        'UPDATE productos SET nombre = ?, descripcion = ?, precio = ? WHERE id = ?',
        [nombre, descripcion, precio, id]
      );
    }
    res.json({ mensaje: 'Producto actualizado correctamente' });
  } catch (error) {
    res.status(500).json({ error: 'Error al actualizar el producto' });
  }
});

// ============================
// Eliminar producto
// ============================
router.delete('/productos/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await db.query('DELETE FROM productos WHERE id = ?', [id]);
    res.json({ mensaje: 'Producto eliminado correctamente' });
  } catch (error) {
    res.status(500).json({ error: 'Error al eliminar el producto' });
  }
});


// ============================
// Registrar una compra
// ============================
router.post('/compras', async (req, res) => {
  const { formaPago, total, productos } = req.body;

  try {
    // Inserta la compra
    const [compraResult] = await db.query(
      'INSERT INTO compras (fecha, forma_pago, total) VALUES (NOW(), ?, ?)',
      [formaPago, total]
    );
    const compraId = compraResult.insertId;

    // Inserta los productos de la compra
    const detalles = productos.map(p => [
      compraId,
      p.productoId,
      p.cantidad,
      p.precio
    ]);
    await db.query(
      'INSERT INTO detalle_compra (compra_id, producto_id, cantidad, precio_unitario) VALUES ?',
      [detalles]
    );

    res.json({ success: true, compraId });
  } catch (err) {
    res.status(500).json({ error: err });
  }
});

module.exports = router;
