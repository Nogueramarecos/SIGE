const express = require('express');
const oracledb = require('oracledb');
const dbConfig = require('../js/db');

const { registrarAcceso } = require('../controllers/logAccesos.controller');

const router = express.Router();

router.post('/login', async (req, res) => {

  console.log('DATOS RECIBIDOS:', req.body);

  const { usuario, clave } = req.body;

  console.log('USUARIO:', usuario);
  console.log('CLAVE:', clave);

  let connection;

  try {
    connection = await oracledb.getConnection(dbConfig);

    const result = await connection.execute(
      `SELECT 
          u.usuario_id,
          u.nombre,
          u.apellido,
          u.username,
          r.nombre AS rol
       FROM usuarios u
       INNER JOIN roles r ON u.rol_id = r.rol_id
       WHERE u.username = :usuario
       AND u.password_hash = :clave
       AND u.activo = 'S'`,
      { usuario, clave },
      { outFormat: oracledb.OUT_FORMAT_OBJECT }
    );

    console.log('RESULTADO LOGIN:', result.rows);

    if (result.rows.length > 0) {
      const usuarioEncontrado = result.rows[0];

      await registrarAcceso(
        usuarioEncontrado.USUARIO_ID,
        usuarioEncontrado.USERNAME,
        usuarioEncontrado.ROL,
        'LOGIN EXITOSO',
        req.ip
      );

      res.json({
        success: true,
        message: 'Login exitoso',
        usuario: usuarioEncontrado.NOMBRE,
        username: usuarioEncontrado.USERNAME,
        rol: usuarioEncontrado.ROL
      });

    } else {

      await registrarAcceso(
        null,
        usuario,
        'SIN ROL',
        'LOGIN FALLIDO',
        req.ip
      );

      res.json({
        success: false,
        message: 'Usuario o contraseña incorrectos'
      });
    }

  } catch (error) {
    console.error('ERROR LOGIN:', error);

    res.status(500).json({
      success: false,
      message: 'Error del servidor: ' + error.message
    });

  } finally {
    if (connection) {
      try {
        await connection.close();
      } catch (error) {
        console.error('Error cerrando conexión:', error);
      }
    }
  }
});

module.exports = router;