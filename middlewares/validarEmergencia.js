function validarEmergencia(req, res, next) {
  const { tipo, prioridad, estado, descripcion, direccion, ciudad } = req.body;

  if (!tipo || !prioridad || !descripcion || !direccion || !ciudad) {
    return res.status(400).json({
      success: false,
      message: 'Complete todos los campos obligatorios'
    });
  }

  if (estado) {
    const estadosPermitidos = [
      'PENDIENTE',
      'ASIGNADA',
      'EN_PROCESO',
      'ATENDIDA',
      'CANCELADA',
      'RESUELTO',
      'RESUELTA'
    ];

    const estadoFinal = estado.trim().toUpperCase().replace(/\s+/g, '_');

    if (!estadosPermitidos.includes(estadoFinal)) {
      return res.status(400).json({
        success: false,
        message: 'Estado no válido'
      });
    }
  }

  next();
}

module.exports = validarEmergencia;