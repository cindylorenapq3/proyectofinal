const express = require('express');
const router = express.Router();
const User = require('../models/User');
const verificarToken = require('../middleware/auth');

// PUT /api/users/perfil - Actualizar perfil del usuario
router.put('/perfil', verificarToken, async (req, res) => {
  try {
    const { nombre, bio, avatar } = req.body;

    const usuario = await User.findByIdAndUpdate(
      req.usuario._id,
      { nombre, bio, avatar },
      { new: true, runValidators: true }
    );

    res.json({
      mensaje: 'Perfil actualizado exitosamente',
      usuario: {
        id: usuario._id,
        nombre: usuario.nombre,
        email: usuario.email,
        bio: usuario.bio,
        avatar: usuario.avatar
      }
    });
  } catch (error) {
    res.status(500).json({ 
      error: 'Error al actualizar perfil',
      detalle: error.message 
    });
  }
});

// PUT /api/users/password - Cambiar contraseña
router.put('/password', verificarToken, async (req, res) => {
  try {
    const { passwordActual, passwordNuevo } = req.body;

    const usuario = await User.findById(req.usuario._id);

    // Verificar contraseña actual
    const passwordCorrecto = await usuario.compararPassword(passwordActual);
    if (!passwordCorrecto) {
      return res.status(401).json({ 
        error: 'Contraseña actual incorrecta' 
      });
    }

    // Actualizar contraseña
    usuario.password = passwordNuevo;
    await usuario.save();

    res.json({
      mensaje: 'Contraseña actualizada exitosamente'
    });
  } catch (error) {
    res.status(500).json({ 
      error: 'Error al cambiar contraseña',
      detalle: error.message 
    });
  }
});

module.exports = router;