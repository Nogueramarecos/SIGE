const express = require('express');
const oracledb = require('oracledb');
const path = require('path');
const bodyParser = require('body-parser');

const config = require('./db');

const emergenciasRoutes = require('../routes/emergencias');

const app = express();

const PORT = 3000;

/* =========================================
   MIDDLEWARES
========================================= */

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

/* =========================================
   ARCHIVOS ESTÁTICOS
========================================= */

app.use(express.static(path.join(__dirname, '../public')));

/* =========================================
   RUTAS API
========================================= */

app.use('/api', emergenciasRoutes);

/* =========================================
   LOGIN
========================================= */

app.post('/api/login', async (req, res) => {

  const { username, password } = req.body;

  let connection;

  try {

    connection = await oracledb.getConnection(config);

    const result = await connection.execute(

      `SELECT
          usuario_id,
          nombre,
          apellido,
          username
       FROM usuarios
       WHERE username = :username
       AND password_hash = :password
       AND activo = 'S'`,

      { username, password }

    );

    if (result.rows.length > 0) {

      const usuarioEncontrado = result.rows[0];

      res.json({
        success: true,
        message: 'Login exitoso',
        usuario: usuarioEncontrado
      });

    } else {

      res.status(401).json({
        success: false,
        message: 'Usuario o contraseña incorrectos'
      });
    }

  } catch (err) {

    console.error('ERROR LOGIN:', err);

    res.status(500).json({
      success: false,
      message: 'Error del servidor: ' + err.message
    });

  } finally {

    if (connection) {
      await connection.close();
    }
  }
});

/* =========================================
   PÁGINA PRINCIPAL
========================================= */

app.get('/', (req, res) => {

  res.sendFile(path.join(__dirname, '../public/login.html'));

});

/* =========================================
   INICIAR SERVIDOR
========================================= */

app.listen(PORT, () => {

  console.log(`Servidor SIGE corriendo en http://localhost:${PORT}`);

});
