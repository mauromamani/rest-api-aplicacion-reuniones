const { Router } = require('express');
const {
  crearEstado,
  modificarEstado,
  obtenerEstados,
  eliminarEstado,
} = require('../controllers/estado');
const router = Router();

router.post('/', crearEstado);
router.get('/', obtenerEstados);
router.put('/:id', modificarEstado);
router.delete('/:id', eliminarEstado);

module.exports = router;