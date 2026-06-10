const express = require('express');
const oracledb = require('oracledb');
const dbConfig = require('../js/db');

const router = express.Router();

/* LISTAR UNIDADES */
router.get('/unidades', async (req, res) => {
  let connection;

  try {
    connection = await oracledb.getConnection(dbConfig);

    const result = await connection.execute(
  `SELECT 
      u.unidad_id AS "UNIDAD_ID",
      u.institucion_id AS "INSTITUCION_ID",
      i.nombre AS "INSTITUCION",
      u.codigo AS "CODIGO",
      u.tipo AS "TIPO",
      u.descripcion AS "DESCRIPCION",
      u.estado AS "ESTADO",
      u.activo AS "ACTIVO"
   FROM unidades u
   INNER JOIN instituciones i
      ON u.institucion_id = i.institucion_id
   ORDER BY u.unidad_id DESC`,
  [],
  { outFormat: oracledb.OUT_FORMAT_OBJECT }
);

    res.json(result.rows);

  } catch (error) {
    console.error('ERROR LISTAR UNIDADES:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });

  } finally {
    if (connection) await connection.close();
  }
});

/* CREAR UNIDAD */
router.post('/unidades', async (req, res) => {
  let { institucion_id, codigo, tipo, descripcion, estado } = req.body;
  let connection;

  if (!institucion_id || !codigo || !tipo || !estado) {
    return res.json({
      success: false,
      message: 'Complete todos los campos obligatorios'
    });
  }

  estado = estado.trim().toUpperCase();

  if (estado === 'FUERA_SERVICIO') {
    estado = 'FUERA DE SERVICIO';
  }

  try {
    connection = await oracledb.getConnection(dbConfig);

    await connection.execute(
      `INSERT INTO unidades
       (institucion_id, codigo, tipo, descripcion, estado, activo)
       VALUES
       (:institucion_id, :codigo, :tipo, :descripcion, :estado, 'S')`,
      {
        institucion_id: Number(institucion_id),
        codigo: codigo.trim().toUpperCase(),
        tipo: tipo.trim().toUpperCase(),
        descripcion: descripcion ? descripcion.trim() : '',
        estado
      },
      { autoCommit: true }
    );

    res.json({
      success: true,
      message: 'Unidad registrada correctamente'
    });

  } catch (error) {
    console.error('ERROR CREAR UNIDAD:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });

  } finally {
    if (connection) await connection.close();
  }
});

module.exports = router;