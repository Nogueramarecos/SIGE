const express = require('express');
const router = express.Router();

const logsController = require('../controllers/logs_controllers');

router.get('/logs', logsController.listarLogs);

module.exports = router;