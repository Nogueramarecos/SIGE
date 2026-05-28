const express = require('express');
const oracledb = require('oracledb');
const dbConfig = require('../js/db');

const router = express.Router();

/* LISTAR EMERGENCIAS */
router.get('/emergencias', async (req, res) => {
  let connection;

  try {
    connection = await oracledb.getConnection(dbConfig);

    const result = await connection.execute(
      `SELECT emergencia_id, tipo, prioridad, estado, descripcion, direccion, ciudad, fecha_reporte
       FROM emergencias
       ORDER BY emergencia_id DESC`,
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
router.post('/emergencias', async (req, res) => {
  const { tipo, prioridad, descripcion, direccion, ciudad } = req.body;
  let connection;

  try {
    connection = await oracledb.getConnection(dbConfig);

    await connection.execute(
      `INSERT INTO emergencias
       (usuario_id, tipo, prioridad, descripcion, direccion, ciudad)
       VALUES
       (1, :tipo, :prioridad, :descripcion, :direccion, :ciudad)`,

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

    res.status(500).json({
      success: false,
      message: error.message
    });

  } finally {

    if (connection) await connection.close();

  }
});

/* ACTUALIZAR EMERGENCIA */
router.put('/emergencias/:id', async (req, res) => {
  const { id } = req.params;
  const { tipo, prioridad, estado, descripcion, direccion, ciudad } = req.body;
  let connection;

  try {
    connection = await oracledb.getConnection(dbConfig);

    const result = await connection.execute(
      `UPDATE emergencias
       SET tipo = :tipo,
           prioridad = :prioridad,
           estado = :estado,
           descripcion = :descripcion,
           direccion = :direccion,
           ciudad = :ciudad
       WHERE emergencia_id = :id`,
      { tipo, prioridad, estado, descripcion, direccion, ciudad, id },
      { autoCommit: true }
    );

    if (result.rowsAffected === 0) {
      return res.json({ success: false, message: 'No existe una emergencia con ese ID' });
    }

    res.json({ success: true, message: 'Emergencia actualizada correctamente' });
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
      return res.json({ success: false, message: 'No existe una emergencia con ese ID' });
    }

    res.json({ success: true, message: 'Emergencia eliminada correctamente' });
  } catch (error) {
    console.error('ERROR ELIMINAR EMERGENCIA:', error);
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
        emergencia_id,
        tipo,
        prioridad,
        estado,
        ciudad,
        fecha_reporte
      FROM emergencias
    `;

    if (tipo === 'pendientes') {
      sql += ` WHERE UPPER(estado) = 'PENDIENTE'`;
    } else if (tipo === 'resueltas') {
      sql += ` WHERE UPPER(estado) = 'RESUELTO'`;
    } else if (tipo === 'alta') {
      sql += ` WHERE UPPER(prioridad) = 'ALTA'`;
    }

    sql += ` ORDER BY fecha_reporte DESC`;

    const result = await connection.execute(
      sql,
      [],
      { outFormat: oracledb.OUT_FORMAT_OBJECT }
    );

    res.json(result.rows);

  } catch (error) {
    console.error('ERROR REPORTES:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });

  } finally {
    if (connection) await connection.close();
  }
});


/* DASHBOARD DE EMERGENCIAS */
router.get('/dashboard/emergencias', async (req, res) => {
  let connection;

  try {
    connection = await oracledb.getConnection(dbConfig);

    const result = await connection.execute(
      `
      SELECT
        COUNT(*) AS total,

        SUM(CASE WHEN UPPER(estado) = 'PENDIENTE' THEN 1 ELSE 0 END) AS pendientes,
        SUM(CASE WHEN UPPER(estado) = 'RESUELTO' THEN 1 ELSE 0 END) AS resueltas,
        SUM(CASE WHEN UPPER(estado) = 'EN PROCESO' THEN 1 ELSE 0 END) AS en_proceso,

        SUM(CASE WHEN UPPER(prioridad) = 'ALTA' THEN 1 ELSE 0 END) AS alta,
        SUM(CASE WHEN UPPER(prioridad) = 'MEDIA' THEN 1 ELSE 0 END) AS media,
        SUM(CASE WHEN UPPER(prioridad) = 'BAJA' THEN 1 ELSE 0 END) AS baja
      FROM emergencias
      `,
      [],
      { outFormat: oracledb.OUT_FORMAT_OBJECT }
    );

    const fila = result.rows[0];

    res.json({
      total: fila.TOTAL || 0,
      pendientes: fila.PENDIENTES || 0,
      resueltas: fila.RESUELTAS || 0,
      en_proceso: fila.EN_PROCESO || 0,
      alta: fila.ALTA || 0,
      media: fila.MEDIA || 0,
      baja: fila.BAJA || 0
    });

  } catch (error) {
    console.error('ERROR DASHBOARD:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });

  } finally {
    if (connection) await connection.close();
  }
});

module.exports = router;
