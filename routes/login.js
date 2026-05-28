const express = require('express');
const oracledb = require('oracledb');
const dbConfig = require('../js/db');

const router = express.Router();

router.post('/login', async (req, res) => {
  const { usuario, clave } = req.body;

  let connection;

  try {
    connection = await oracledb.getConnection(dbConfig);

    const result = await connection.execute(
      `SELECT usuario_id, nombre, apellido, username
       FROM usuarios
       WHERE username = :usuario
       AND password_hash = :clave
       AND activo = 'S'`,
      { usuario, clave }
    );

    if (result.rows.length > 0) {
      const usuarioEncontrado = result.rows[0];

      res.json({
        success: true,
        message: 'Login exitoso',
        usuario: usuarioEncontrado[1]
      });
    } else {
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