const { Router } = require('express');
const {
  crearEstado,
  modificarEstado,
  obtenerEstados,
  eliminarEstado,
} = require('../controllers/estado');
const {
  verificarAutenticacion,
} = require('../middlewares/verificarAutenticacion');
const { verificarPermisos } = require('../middlewares/verificarPermisos');
const router = Router();

router.post('/', [verificarAutenticacion, verificarPermisos], crearEstado);
router.get('/', obtenerEstados);
router.put(
  '/:id',
  [verificarAutenticacion, verificarPermisos],
  modificarEstado
);
router.delete(
  '/:id',
  [verificarAutenticacion, verificarPermisos],
  eliminarEstado
);

module.exports = router;
