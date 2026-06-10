const oracledb = require('oracledb');
const dbConfig = require('../js/db');

exports.listarAuditoriaEmergencias = async (req, res) => {
  let connection;

  try {
    connection = await oracledb.getConnection(dbConfig);

    const result = await connection.execute(
      `SELECT 
          AUDITORIA_ID,
          EMERGENCIA_ID,
          ACCION,
          TIPO_ANTERIOR,
          TIPO_NUEVO,
          PRIORIDAD_ANTERIOR,
          PRIORIDAD_NUEVA,
          ESTADO_ANTERIOR,
          ESTADO_NUEVO,
          DESCRIPCION_ANTERIOR,
          DESCRIPCION_NUEVA,
          DIRECCION_ANTERIOR,
          DIRECCION_NUEVA,
          CIUDAD_ANTERIOR,
          CIUDAD_NUEVA,
          TO_CHAR(FECHA_ACCION, 'DD/MM/YYYY HH24:MI:SS') AS FECHA_ACCION,
          USUARIO_BD
       FROM AUDITORIA_EMERGENCIAS
       ORDER BY AUDITORIA_ID DESC`,
      [],
      { outFormat: oracledb.OUT_FORMAT_OBJECT }
    );

    res.json(result.rows);

  } catch (error) {
    console.error('Error al listar auditoría:', error);
    res.status(500).json({ error: 'Error al obtener auditoría de emergencias' });
  } finally {
    if (connection) await connection.close();
  }
};