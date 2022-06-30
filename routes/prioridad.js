const { Router } = require('express');
const {
  crearPrioridad,
  modificarPrioridad,
  obtenerPrioridades,
  eliminarPrioridad,
} = require('../controllers/prioridad');
const router = Router();

router.post('/', crearPrioridad);
router.get('/', obtenerPrioridades);
router.put('/:id', modificarPrioridad);
router.delete('/:id', eliminarPrioridad);

module.exports = router;