const { Router } = require('express');
const {
  crearDependencia,
  modificarDependencia,
  obtenerDependencias,
  eliminarDependencia,
} = require('../controllers/dependencia');
const {
  verificarAutenticacion,
} = require('../middlewares/verificarAutenticacion');
const { verificarPermisos } = require('../middlewares/verificarPermisos');
const router = Router();

router.post('/', [verificarAutenticacion, verificarPermisos], crearDependencia);
router.get('/', obtenerDependencias);
router.put(
  '/:id',
  [verificarAutenticacion, verificarPermisos],
  modificarDependencia
);
router.delete(
  '/:id',
  [verificarAutenticacion, verificarPermisos],
  eliminarDependencia
);

module.exports = router;
