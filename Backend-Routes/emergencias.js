const express = require('express');
const oracledb = require('oracledb');
const dbConfig = require('../js/db');

const router = express.Router();
const validarEmergencia = require('../middlewares/validarEmergencia');

/* LISTAR EMERGENCIAS */
router.get('/emergencias', async (req, res) => {
  let connection;

  try {
    connection = await oracledb.getConnection(dbConfig);

    const result = await connection.execute(
      `SELECT 
          e.emergencia_id,
          e.tipo,
          e.prioridad,
          e.estado,
          e.descripcion,
          e.direccion,
          e.ciudad,
          e.fecha_reporte,
          e.fecha_cierre,
          e.institucion_id,
          e.unidad_id,
          i.nombre AS institucion,
          u.codigo AS unidad,
          e.fecha_asignacion,
          e.fecha_atencion
       FROM emergencias e
       LEFT JOIN instituciones i
          ON e.institucion_id = i.institucion_id
       LEFT JOIN unidades u
          ON e.unidad_id = u.unidad_id
       ORDER BY e.emergencia_id DESC`,
      [],
      { outFormat: oracledb.OUT_FORMAT_OBJECT }
    );

    res.json(result.rows);

  } catch (error) {
    console.error('ERROR LISTAR EMERGENCIAS:', error);
    res.status(500).json({ success: false, message: error.message });

  } finally {
    if (connection) await connection.close();
  }
});

/* CREAR EMERGENCIA */
router.post('/emergencias', validarEmergencia, async (req, res) => {
  const { tipo, prioridad, descripcion, direccion, ciudad } = req.body;
  let connection;

  try {
    connection = await oracledb.getConnection(dbConfig);

    await connection.execute(
      `INSERT INTO emergencias
       (usuario_id, tipo, prioridad, estado, descripcion, direccion, ciudad)
       VALUES
       (1, :tipo, :prioridad, 'PENDIENTE', :descripcion, :direccion, :ciudad)`,
      {
        tipo: tipo.toUpperCase(),
        prioridad: prioridad.toUpperCase(),
        descripcion,
        direccion,
        ciudad
      },
      { autoCommit: true }
    );

    res.json({
      success: true,
      message: 'Emergencia registrada correctamente'
    });

  } catch (error) {
    console.error('ERROR CREAR EMERGENCIA:', error);
    res.status(500).json({ success: false, message: error.message });

  } finally {
    if (connection) await connection.close();
  }
});

/* ACTUALIZAR EMERGENCIA */
router.put('/emergencias/:id', validarEmergencia, async (req, res) => {
  const { id } = req.params;

  const {
    tipo,
    prioridad,
    estado,
    descripcion,
    direccion,
    ciudad,
    institucion_id,
    unidad_id
  } = req.body;

  let connection;

  try {
    connection = await oracledb.getConnection(dbConfig);

    const estadoNormalizado = estado.trim().toUpperCase().replace(/\s+/g, '_');

    const result = await connection.execute(
      `UPDATE emergencias
       SET tipo = :tipo,
           prioridad = :prioridad,
           estado = :estado,
           descripcion = :descripcion,
           direccion = :direccion,
           ciudad = :ciudad,
           institucion_id = :institucion_id,
           unidad_id = :unidad_id,
           fecha_asignacion = CASE 
              WHEN :institucion_id IS NOT NULL OR :unidad_id IS NOT NULL 
              THEN NVL(fecha_asignacion, SYSTIMESTAMP)
              ELSE fecha_asignacion
           END,
           fecha_atencion = CASE
              WHEN :estado = 'ATENDIDA'
              THEN NVL(fecha_atencion, SYSTIMESTAMP)
              ELSE fecha_atencion
           END,
           fecha_cierre = CASE
              WHEN :estado IN ('ATENDIDA', 'CANCELADA')
              THEN NVL(fecha_cierre, SYSTIMESTAMP)
              ELSE fecha_cierre
           END
       WHERE emergencia_id = :id`,
      {
        tipo: tipo.trim().toUpperCase(),
        prioridad: prioridad.trim().toUpperCase(),
        estado: estadoNormalizado,
        descripcion,
        direccion,
        ciudad,
        institucion_id: institucion_id || null,
        unidad_id: unidad_id || null,
        id
      },
      { autoCommit: true }
    );

    if (result.rowsAffected === 0) {
      return res.json({
        success: false,
        message: 'No existe una emergencia con ese ID'
      });
    }

    res.json({
      success: true,
      message: 'Emergencia actualizada correctamente'
    });

  } catch (error) {
    console.error('ERROR ACTUALIZAR EMERGENCIA:', error);
    res.status(500).json({ success: false, message: error.message });

  } finally {
    if (connection) await connection.close();
  }
});

/* ELIMINAR EMERGENCIA */
router.delete('/emergencias/:id', async (req, res) => {
  const { id } = req.params;
  let connection;

  try {
    connection = await oracledb.getConnection(dbConfig);

    const result = await connection.execute(
      `DELETE FROM emergencias WHERE emergencia_id = :id`,
      { id },
      { autoCommit: true }
    );

    if (result.rowsAffected === 0) {
      return res.json({
        success: false,
        message: 'No existe una emergencia con ese ID'
      });
    }

    res.json({
      success: true,
      message: 'Emergencia eliminada correctamente'
    });

  } catch (error) {
    console.error('ERROR ELIMINAR EMERGENCIA:', error);
    res.status(500).json({ success: false, message: error.message });

  } finally {
    if (connection) await connection.close();
  }
});

/* LISTAR INSTITUCIONES PARA COMBO */
router.get('/instituciones', async (req, res) => {
  let connection;

  try {
    connection = await oracledb.getConnection(dbConfig);

    const result = await connection.execute(
      `SELECT institucion_id, nombre, tipo
       FROM instituciones
       WHERE activo = 'S'
       ORDER BY nombre`,
      [],
      { outFormat: oracledb.OUT_FORMAT_OBJECT }
    );

    res.json(result.rows);

  } catch (error) {
    console.error('ERROR LISTAR INSTITUCIONES:', error);
    res.status(500).json({ success: false, message: error.message });

  } finally {
    if (connection) await connection.close();
  }
});

/* LISTAR UNIDADES PARA COMBO */
router.get('/unidades', async (req, res) => {
  let connection;

  try {
    connection = await oracledb.getConnection(dbConfig);

    const result = await connection.execute(
      `SELECT 
          u.unidad_id,
          u.codigo,
          u.tipo,
          u.estado,
          u.institucion_id,
          i.nombre AS institucion
       FROM unidades u
       INNER JOIN instituciones i
          ON u.institucion_id = i.institucion_id
       WHERE u.activo = 'S'
       ORDER BY u.codigo`,
      [],
      { outFormat: oracledb.OUT_FORMAT_OBJECT }
    );

    res.json(result.rows);

  } catch (error) {
    console.error('ERROR LISTAR UNIDADES:', error);
    res.status(500).json({ success: false, message: error.message });

  } finally {
    if (connection) await connection.close();
  }
});

/* REPORTES DE EMERGENCIAS */
router.get('/reportes/:tipo', async (req, res) => {
  let connection;

  try {
    connection = await oracledb.getConnection(dbConfig);

    const tipo = req.params.tipo;

    let sql = `
      SELECT
        e.emergencia_id,
        e.tipo,
        e.prioridad,
        e.estado,
        e.ciudad,
        e.fecha_reporte,
        e.fecha_cierre,
        i.nombre AS institucion,
        u.codigo AS unidad
      FROM emergencias e
      LEFT JOIN instituciones i
        ON e.institucion_id = i.institucion_id
      LEFT JOIN unidades u
        ON e.unidad_id = u.unidad_id
    `;

    if (tipo === 'pendientes') {
      sql += ` WHERE UPPER(e.estado) = 'PENDIENTE'`;
    } else if (tipo === 'resueltas') {
      sql += ` WHERE UPPER(e.estado) IN ('ATENDIDA', 'RESUELTO')`;
    } else if (tipo === 'alta') {
      sql += ` WHERE UPPER(e.prioridad) = 'ALTA'`;
    } else if (tipo === 'criticas') {
      sql += ` WHERE UPPER(e.prioridad) = 'ALTA'`;
    } else if (tipo === 'atendidas') {
      sql += ` WHERE UPPER(e.estado) = 'ATENDIDA'`;
    }

    sql += ` ORDER BY e.fecha_reporte DESC`;

    const result = await connection.execute(
      sql,
      [],
      { outFormat: oracledb.OUT_FORMAT_OBJECT }
    );

    res.json(result.rows);

  } catch (error) {
    console.error('ERROR REPORTES:', error);
    res.status(500).json({ success: false, message: error.message });

  } finally {
    if (connection) await connection.close();
  }
});

/* REPORTE: INSTITUCIONES CON MÁS INTERVENCIONES */
router.get('/reportes-instituciones/intervenciones', async (req, res) => {
  let connection;

  try {
    connection = await oracledb.getConnection(dbConfig);

    const result = await connection.execute(
      `SELECT
          i.nombre AS institucion,
          i.tipo,
          COUNT(e.emergencia_id) AS total_intervenciones
       FROM instituciones i
       LEFT JOIN emergencias e
          ON i.institucion_id = e.institucion_id
       GROUP BY i.nombre, i.tipo
       ORDER BY total_intervenciones DESC`,
      [],
      { outFormat: oracledb.OUT_FORMAT_OBJECT }
    );

    res.json(result.rows);

  } catch (error) {
    console.error('ERROR REPORTE INSTITUCIONES:', error);
    res.status(500).json({ success: false, message: error.message });

  } finally {
    if (connection) await connection.close();
  }
});

/* DASHBOARD DE EMERGENCIAS */
router.get('/dashboard/emergencias', async (req, res) => {
  let connection;

  try {
    connection = await oracledb.getConnection(dbConfig);

    const resumen = await connection.execute(
      `SELECT
        COUNT(*) AS total,
        SUM(CASE WHEN UPPER(TRIM(estado)) = 'PENDIENTE' THEN 1 ELSE 0 END) AS pendientes,
        SUM(CASE WHEN UPPER(TRIM(estado)) = 'ASIGNADA' THEN 1 ELSE 0 END) AS asignadas,
        SUM(CASE WHEN UPPER(TRIM(estado)) = 'EN_PROCESO' THEN 1 ELSE 0 END) AS en_proceso,
        SUM(CASE WHEN UPPER(TRIM(estado)) IN ('ATENDIDA', 'RESUELTO') THEN 1 ELSE 0 END) AS resueltas,
        SUM(CASE WHEN UPPER(TRIM(prioridad)) = 'ALTA' THEN 1 ELSE 0 END) AS alta,
        SUM(CASE WHEN UPPER(TRIM(prioridad)) = 'MEDIA' THEN 1 ELSE 0 END) AS media,
        SUM(CASE WHEN UPPER(TRIM(prioridad)) = 'BAJA' THEN 1 ELSE 0 END) AS baja
       FROM emergencias`,
      [],
      { outFormat: oracledb.OUT_FORMAT_OBJECT }
    );

    const porTipo = await connection.execute(
      `SELECT tipo, COUNT(*) AS total
       FROM emergencias
       GROUP BY tipo
       ORDER BY total DESC`,
      [],
      { outFormat: oracledb.OUT_FORMAT_OBJECT }
    );

    const porInstitucion = await connection.execute(
      `SELECT 
          i.nombre AS institucion,
          COUNT(e.emergencia_id) AS total
       FROM instituciones i
       LEFT JOIN emergencias e
          ON i.institucion_id = e.institucion_id
       GROUP BY i.nombre
       ORDER BY total DESC`,
      [],
      { outFormat: oracledb.OUT_FORMAT_OBJECT }
    );

    const fila = resumen.rows[0];

    res.json({
      total: fila.TOTAL || 0,
      pendientes: fila.PENDIENTES || 0,
      asignadas: fila.ASIGNADAS || 0,
      en_proceso: fila.EN_PROCESO || 0,
      resueltas: fila.RESUELTAS || 0,
      alta: fila.ALTA || 0,
      media: fila.MEDIA || 0,
      baja: fila.BAJA || 0,
      porTipo: porTipo.rows,
      porInstitucion: porInstitucion.rows
    });

  } catch (error) {
    console.error('ERROR DASHBOARD:', error);
    res.status(500).json({ success: false, message: error.message });

  } finally {
    if (connection) await connection.close();
  }
});

module.exports = router;