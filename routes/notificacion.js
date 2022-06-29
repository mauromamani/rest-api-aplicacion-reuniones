const { Router } = require('express');
const {
  obtenerNotificaciones,
  obtenerNotificacionPorId,
} = require('../controllers/notificaciones');
const router = Router();

router.get('/', obtenerNotificaciones);
router.get('/:id', obtenerNotificacionPorId);

module.exports = router;
