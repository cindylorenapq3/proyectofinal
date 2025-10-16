const express = require('express');
const router = express.Router();
const Task = require('../models/Task');
const verificarToken = require('../middleware/auth');

// Todas las rutas requieren autenticación
router.use(verificarToken);

// GET /api/tasks - Obtener todas las tareas del usuario
router.get('/', async (req, res) => {
  try {
    const tareas = await Task.find({ usuario: req.usuario._id })
      .sort({ createdAt: -1 });
    
    res.json({
      tareas,
      total: tareas.length
    });
  } catch (error) {
    res.status(500).json({ 
      error: 'Error al obtener tareas',
      detalle: error.message 
    });
  }
});

// GET /api/tasks/:id - Obtener una tarea específica
router.get('/:id', async (req, res) => {
  try {
    const tarea = await Task.findOne({
      _id: req.params.id,
      usuario: req.usuario._id
    });

    if (!tarea) {
      return res.status(404).json({ error: 'Tarea no encontrada' });
    }

    res.json({ tarea });
  } catch (error) {
    res.status(500).json({ 
      error: 'Error al obtener tarea',
      detalle: error.message 
    });
  }
});

// POST /api/tasks - Crear nueva tarea
router.post('/', async (req, res) => {
  try {
    const { titulo, descripcion, prioridad, fechaVencimiento } = req.body;

    const tarea = new Task({
      titulo,
      descripcion,
      prioridad,
      fechaVencimiento,
      usuario: req.usuario._id
    });

    await tarea.save();

    res.status(201).json({
      mensaje: 'Tarea creada exitosamente',
      tarea
    });
  } catch (error) {
    res.status(500).json({ 
      error: 'Error al crear tarea',
      detalle: error.message 
    });
  }
});

// PUT /api/tasks/:id - Actualizar tarea
router.put('/:id', async (req, res) => {
  try {
    const { titulo, descripcion, completada, prioridad, fechaVencimiento } = req.body;

    const tarea = await Task.findOneAndUpdate(
      { _id: req.params.id, usuario: req.usuario._id },
      { titulo, descripcion, completada, prioridad, fechaVencimiento },
      { new: true, runValidators: true }
    );

    if (!tarea) {
      return res.status(404).json({ error: 'Tarea no encontrada' });
    }

    res.json({
      mensaje: 'Tarea actualizada exitosamente',
      tarea
    });
  } catch (error) {
    res.status(500).json({ 
      error: 'Error al actualizar tarea',
      detalle: error.message 
    });
  }
});

// DELETE /api/tasks/:id - Eliminar tarea
router.delete('/:id', async (req, res) => {
  try {
    const tarea = await Task.findOneAndDelete({
      _id: req.params.id,
      usuario: req.usuario._id
    });

    if (!tarea) {
      return res.status(404).json({ error: 'Tarea no encontrada' });
    }

    res.json({
      mensaje: 'Tarea eliminada exitosamente',
      tarea
    });
  } catch (error) {
    res.status(500).json({ 
      error: 'Error al eliminar tarea',
      detalle: error.message 
    });
  }
});

// PATCH /api/tasks/:id/toggle - Cambiar estado de completada
router.patch('/:id/toggle', async (req, res) => {
  try {
    const tarea = await Task.findOne({
      _id: req.params.id,
      usuario: req.usuario._id
    });

    if (!tarea) {
      return res.status(404).json({ error: 'Tarea no encontrada' });
    }

    tarea.completada = !tarea.completada;
    await tarea.save();

    res.json({
      mensaje: 'Estado actualizado',
      tarea
    });
  } catch (error) {
    res.status(500).json({ 
      error: 'Error al actualizar estado',
      detalle: error.message 
    });
  }
});

module.exports = router;