const express = require('express');
const oracledb = require('oracledb');
const dbConfig = require('../js/db');

const router = express.Router();

/* LISTAR INSTITUCIONES */
router.get('/instituciones', async (req, res) => {
  let connection;

  try {
    connection = await oracledb.getConnection(dbConfig);

    const result = await connection.execute(
      `SELECT
          institucion_id AS "INSTITUCION_ID",
          nombre AS "NOMBRE",
          tipo AS "TIPO",
          telefono AS "TELEFONO",
          direccion AS "DIRECCION",
          ciudad AS "CIUDAD",
          activo AS "ACTIVO",
          fecha_creacion AS "FECHA_CREACION"
       FROM instituciones
       ORDER BY institucion_id DESC`,
      [],
      { outFormat: oracledb.OUT_FORMAT_OBJECT }
    );

    res.json(result.rows);

  } catch (error) {
    console.error('ERROR LISTAR INSTITUCIONES:', error);

    res.status(500).json({
      success: false,
      message: error.message
    });

  } finally {
    if (connection) {
      await connection.close();
    }
  }
});

/* CREAR INSTITUCIÓN */
router.post('/instituciones', async (req, res) => {
  const { nombre, tipo, telefono, direccion, ciudad } = req.body;

  let connection;

  if (!nombre || !tipo || !telefono || !direccion || !ciudad) {
    return res.json({
      success: false,
      message: 'Complete todos los campos'
    });
  }

  try {
    connection = await oracledb.getConnection(dbConfig);

    await connection.execute(
      `INSERT INTO instituciones
       (nombre, tipo, telefono, direccion, ciudad, activo, fecha_creacion)
       VALUES
       (:nombre, :tipo, :telefono, :direccion, :ciudad, 'S', SYSDATE)`,
      {
        nombre: nombre.trim(),
        tipo: tipo.trim().toUpperCase(),
        telefono: telefono.trim(),
        direccion: direccion.trim(),
        ciudad: ciudad.trim()
      },
      { autoCommit: true }
    );

    res.json({
      success: true,
      message: 'Institución registrada correctamente'
    });

  } catch (error) {
    console.error('ERROR CREAR INSTITUCIÓN:', error);

    res.status(500).json({
      success: false,
      message: error.message
    });

  } finally {
    if (connection) {
      await connection.close();
    }
  }
});

module.exports = router;