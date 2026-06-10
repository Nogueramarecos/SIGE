const express = require('express');
const oracledb = require('oracledb');
const dbConfig = require('../js/db');

const router = express.Router();

/* LISTAR USUARIOS */
router.get('/usuarios', async (req, res) => {
  let connection;

  try {
    connection = await oracledb.getConnection(dbConfig);

    const result = await connection.execute(
      `SELECT 
          u.usuario_id,
          u.nombre,
          u.apellido,
          u.email,
          u.username,
          u.activo,
          u.fecha_registro,
          r.nombre AS rol
       FROM usuarios u
       INNER JOIN roles r ON u.rol_id = r.rol_id
       ORDER BY u.usuario_id`,
      [],
      { outFormat: oracledb.OUT_FORMAT_OBJECT }
    );

    res.json(result.rows);

  } catch (error) {
    console.error('ERROR LISTANDO USUARIOS:', error);
    res.status(500).json({ message: 'Error al listar usuarios' });

  } finally {
    if (connection) {
      await connection.close();
    }
  }
});

/* LISTAR ROLES ACTIVOS */
router.get('/roles', async (req, res) => {
  let connection;

  try {
    connection = await oracledb.getConnection(dbConfig);

    const result = await connection.execute(
      `SELECT rol_id, nombre
       FROM roles
       WHERE activo = 'S'
       ORDER BY rol_id`,
      [],
      { outFormat: oracledb.OUT_FORMAT_OBJECT }
    );

    res.json(result.rows);

  } catch (error) {
    console.error('ERROR LISTANDO ROLES:', error);
    res.status(500).json({ message: 'Error al listar roles' });

  } finally {
    if (connection) {
      await connection.close();
    }
  }
});

/* CREAR USUARIO */
router.post('/usuarios', async (req, res) => {
  const { rol_id, nombre, apellido, email, username, password } = req.body;

  let connection;

  try {
    connection = await oracledb.getConnection(dbConfig);

    await connection.execute(
      `INSERT INTO usuarios (
      rol_id,
      nombre,
      apellido,
      email,
      username,
      password_hash,
      activo,
      fecha_registro
   ) VALUES (
      :rol_id,
      :nombre,
      :apellido,
      :email,
      :username,
      :password,
      'S',
      SYSDATE
   )`,
  { rol_id, nombre, apellido, email, username, password },
  { autoCommit: true }
);
    res.json({
      success: true,
      message: 'Usuario creado correctamente'
    });

  } catch (error) {
    console.error('ERROR CREANDO USUARIO:', error);
    res.status(500).json({
      success: false,
      message: 'Error al crear usuario: ' + error.message
    });

  } finally {
    if (connection) {
      await connection.close();
    }
  }
});

/* DESACTIVAR USUARIO */
router.put('/usuarios/:id/desactivar', async (req, res) => {
  const id = req.params.id;

  let connection;

  try {
    connection = await oracledb.getConnection(dbConfig);

    await connection.execute(
      `UPDATE usuarios
       SET activo = 'N'
       WHERE usuario_id = :id`,
      { id },
      { autoCommit: true }
    );

    res.json({
      success: true,
      message: 'Usuario desactivado correctamente'
    });

  } catch (error) {
    console.error('ERROR DESACTIVANDO USUARIO:', error);
    res.status(500).json({
      success: false,
      message: 'Error al desactivar usuario'
    });

  } finally {
    if (connection) {
      await connection.close();
    }
  }
});


/* OBTENER USUARIO POR ID */
router.get('/usuarios/:id', async (req, res) => {
  const id = req.params.id;

  let connection;

  try {
    connection = await oracledb.getConnection(dbConfig);

    const result = await connection.execute(
      `SELECT 
          usuario_id,
          rol_id,
          nombre,
          apellido,
          email,
          username,
          activo
       FROM usuarios
       WHERE usuario_id = :id`,
      { id },
      { outFormat: oracledb.OUT_FORMAT_OBJECT }
    );

    if (result.rows.length > 0) {
      res.json(result.rows[0]);
    } else {
      res.status(404).json({
        message: 'Usuario no encontrado'
      });
    }

  } catch (error) {
    console.error('ERROR OBTENIENDO USUARIO:', error);

    res.status(500).json({
      message: 'Error al obtener usuario'
    });

  } finally {
    if (connection) {
      await connection.close();
    }
  }
});

/* EDITAR USUARIO */
router.put('/usuarios/:id', async (req, res) => {
  const id = req.params.id;
  const { rol_id, nombre, apellido, email, username } = req.body;

  let connection;

  try {
    connection = await oracledb.getConnection(dbConfig);

    await connection.execute(
      `UPDATE usuarios
       SET rol_id = :rol_id,
           nombre = :nombre,
           apellido = :apellido,
           email = :email,
           username = :username
       WHERE usuario_id = :id`,
      { rol_id, nombre, apellido, email, username, id },
      { autoCommit: true }
    );

    res.json({
      success: true,
      message: 'Usuario actualizado correctamente'
    });

  } catch (error) {
    console.error('ERROR ACTUALIZANDO USUARIO:', error);
    res.status(500).json({
      success: false,
      message: 'Error al actualizar usuario'
    });

  } finally {
    if (connection) {
      await connection.close();
    }
  }
});

/* ACTIVAR USUARIO */
router.put('/usuarios/:id/activar', async (req, res) => {
  const id = req.params.id;

  let connection;

  try {
    connection = await oracledb.getConnection(dbConfig);

    await connection.execute(
      `UPDATE usuarios
       SET activo = 'S'
       WHERE usuario_id = :id`,
      { id },
      { autoCommit: true }
    );

    res.json({
      success: true,
      message: 'Usuario activado correctamente'
    });

  } catch (error) {
    console.error('ERROR ACTIVANDO USUARIO:', error);
    res.status(500).json({
      success: false,
      message: 'Error al activar usuario'
    });

  } finally {
    if (connection) {
      await connection.close();
    }
  }
});

module.exports = router;