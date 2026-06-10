const express = require('express');
const oracledb = require('oracledb');
const path = require('path');
const bodyParser = require('body-parser');

const config = require('../js/db');
const emergenciasRoutes = require('../Backend-Routes/emergencias');
const usuariosRoutes = require('../Backend-Routes/usuarios');
const auditoriaRoutes = require('../Backend-Routes/auditoria');
const manejoErrores = require('../middlewares/manejoErrores');
const logsRoutes = require('../Backend-Routes/logs');
const institucionesRoutes = require('../Backend-Routes/instituciones');
const unidadesRoutes = require('../Backend-Routes/unidades');


const { registrarAcceso } = require('../controllers/logAccesos_controllers');

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
app.use('/api', institucionesRoutes);
app.use('/api', unidadesRoutes);
app.use('/api', emergenciasRoutes);
app.use('/api', usuariosRoutes);
app.use('/api/auditoria', auditoriaRoutes);
app.use('/api', logsRoutes);


/* =========================================
   LOGIN
========================================= */
app.post('/api/login', async (req, res) => {
  const { usuario, clave } = req.body;

  let connection;

  try {
    connection = await oracledb.getConnection(config);

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
      {
        outFormat: oracledb.OUT_FORMAT_OBJECT
      }
    );

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
      try {
        await connection.close();
      } catch (error) {
        console.error(error);
      }
    }
  }
});

/* =========================================
   PÁGINA PRINCIPAL
========================================= */
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/login.html'));
});

app.use(manejoErrores);

/* =========================================
   INICIAR SERVIDOR
========================================= */
app.listen(PORT, () => {
  console.log(`Servidor SIGE corriendo en http://localhost:${PORT}`);
});