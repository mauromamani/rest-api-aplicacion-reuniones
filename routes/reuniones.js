const { Router } = require('express');
const {
  crearReunion,
  modificarReunion,
  eliminarReunion,
  obtenerReuniones,
  obtenerReunionPorId,
  confirmarReunion,
} = require('../controllers/reuniones');

const router = Router();

router.post('/', crearReunion);
router.post('/confirmar', confirmarReunion);
router.get('/', obtenerReuniones);
router.get('/:id', obtenerReunionPorId);
router.put('/:id', modificarReunion);
router.delete('/:id', eliminarReunion);

module.exports = router;
