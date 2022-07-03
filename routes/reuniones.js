const { Router } = require('express');
const {
  crearReunion,
  modificarReunion,
  eliminarReunion,
  obtenerReuniones,
  obtenerReunionPorId,
  confirmarReunion,
} = require('../controllers/reuniones');
const {
  verificarAutenticacion,
} = require('../middlewares/verificarAutenticacion');
const { verificarPermisos } = require('../middlewares/verificarPermisos');

const router = Router();

router.post('/', [verificarAutenticacion, verificarPermisos], crearReunion);
router.post(
  '/confirmar/:id',
  [verificarAutenticacion, verificarPermisos],
  confirmarReunion
);
router.get('/', obtenerReuniones);
router.get('/:id', obtenerReunionPorId);
router.put(
  '/:id',
  [verificarAutenticacion, verificarPermisos],
  modificarReunion
);
router.delete(
  '/:id',
  [verificarAutenticacion, verificarPermisos],
  eliminarReunion
);

module.exports = router;
