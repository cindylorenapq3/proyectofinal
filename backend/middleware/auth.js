const jwt = require('jsonwebtoken');
const User = require('../models/User');

const verificarToken = async (req, res, next) => {
  try {
    // Obtener token del header
    const token = req.header('Authorization')?.replace('Bearer ', '');

    if (!token) {
      return res.status(401).json({ 
        error: 'Acceso denegado. No se proporcionó token.' 
      });
    }

    // Verificar token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Buscar usuario
    const usuario = await User.findById(decoded.id);
    
    if (!usuario) {
      return res.status(401).json({ 
        error: 'Token inválido. Usuario no encontrado.' 
      });
    }

    // Agregar usuario a la request
    req.usuario = usuario;
    next();
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ error: 'Token inválido' });
    }
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ error: 'Token expirado' });
    }
    res.status(500).json({ error: 'Error en el servidor' });
  }
};

module.exports = verificarToken;