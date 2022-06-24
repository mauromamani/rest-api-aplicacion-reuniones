const { Router } = require('express');
const {
  crearTipoReunion,
  modificarTipoReunion,
  obtenerTiposReunion,
  eliminarTipoReunion,
} = require('../controllers/tipoReunion');
const {
  verificarAutenticacion,
} = require('../middlewares/verificarAutenticacion');
const { verificarPermisos } = require('../middlewares/verificarPermisos');
const router = Router();

router.post('/', [verificarAutenticacion, verificarPermisos], crearTipoReunion);
router.get('/', obtenerTiposReunion);
router.put(
  '/:id',
  [verificarAutenticacion, verificarPermisos],
  modificarTipoReunion
);
router.delete(
  '/:id',
  [verificarAutenticacion, verificarPermisos],
  eliminarTipoReunion
);

module.exports = router;
