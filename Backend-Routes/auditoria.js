const express = require('express');
const router = express.Router();

const auditoriaController = require('../controllers/auditoria_controllers');

router.get('/emergencias', auditoriaController.listarAuditoriaEmergencias);

module.exports = router;