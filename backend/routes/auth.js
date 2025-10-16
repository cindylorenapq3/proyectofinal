const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const verificarToken = require('../middleware/auth');

// Generar JWT
const generarToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN
  });
};

// POST /api/auth/registro - Registrar nuevo usuario
router.post('/registro', async (req, res) => {
  try {
    const { nombre, email, password } = req.body;

    // Verificar si el usuario ya existe
    const usuarioExistente = await User.findOne({ email });
    if (usuarioExistente) {
      return res.status(400).json({ 
        error: 'El email ya está registrado' 
      });
    }

    // Crear nuevo usuario
    const usuario = new User({ nombre, email, password });
    await usuario.save();

    // Generar token
    const token = generarToken(usuario._id);

    res.status(201).json({
      mensaje: 'Usuario registrado exitosamente',
      token,
      usuario: {
        id: usuario._id,
        nombre: usuario.nombre,
        email: usuario.email
      }
    });
  } catch (error) {
    res.status(500).json({ 
      error: 'Error al registrar usuario',
      detalle: error.message 
    });
  }
});

// POST /api/auth/login - Iniciar sesión
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Buscar usuario
    const usuario = await User.findOne({ email });
    if (!usuario) {
      return res.status(401).json({ 
        error: 'Credenciales inválidas' 
      });
    }

    // Verificar contraseña
    const passwordCorrecto = await usuario.compararPassword(password);
    if (!passwordCorrecto) {
      return res.status(401).json({ 
        error: 'Credenciales inválidas' 
      });
    }

    // Generar token
    const token = generarToken(usuario._id);

    res.json({
      mensaje: 'Inicio de sesión exitoso',
      token,
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
      error: 'Error al iniciar sesión',
      detalle: error.message 
    });
  }
});

// GET /api/auth/perfil - Obtener perfil del usuario autenticado
router.get('/perfil', verificarToken, async (req, res) => {
  try {
    res.json({
      usuario: {
        id: req.usuario._id,
        nombre: req.usuario.nombre,
        email: req.usuario.email,
        bio: req.usuario.bio,
        avatar: req.usuario.avatar,
        fechaRegistro: req.usuario.fechaRegistro
      }
    });
  } catch (error) {
    res.status(500).json({ 
      error: 'Error al obtener perfil',
      detalle: error.message 
    });
  }
});

module.exports = router;