function manejoErrores(error, req, res, next) {
  console.error('ERROR GENERAL:', error);

  res.status(500).json({
    success: false,
    message: 'Error interno del servidor',
    detalle: error.message
  });
}

module.exports = manejoErrores;