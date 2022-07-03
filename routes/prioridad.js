const { Router } = require('express');
const {
  crearPrioridad,
  modificarPrioridad,
  obtenerPrioridades,
  eliminarPrioridad,
} = require('../controllers/prioridad');
const {
  verificarAutenticacion,
} = require('../middlewares/verificarAutenticacion');
const { verificarPermisos } = require('../middlewares/verificarPermisos');
const router = Router();

router.post('/', [verificarAutenticacion, verificarPermisos], crearPrioridad);
router.get('/', obtenerPrioridades);
router.put(
  '/:id',
  [verificarAutenticacion, verificarPermisos],
  modificarPrioridad
);
router.delete(
  '/:id',
  [verificarAutenticacion, verificarPermisos],
  eliminarPrioridad
);

module.exports = router;
