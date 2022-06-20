const { Router } = require('express');
const {
  crearNotificacion,
  modificarNotificacion,
  obtenerNotificaciones,
  eliminarNotificacion,
} = require('../controllers/notificacion');
const router = Router();

router.post('/', crearNotificacion);
router.get('/', obtenerNotificaciones);
router.put('/:id', modificarNotificacion);
router.delete('/:id', eliminarNotificacion);

module.exports = router;