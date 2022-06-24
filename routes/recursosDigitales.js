const { Router } = require('express');
const {
  crearRecursoDigital,
  obtenerRecursosDigitales,
  modificarRecursoDigital,
  eliminarRecursoDigital,
} = require('../controllers/recursosDigitales');
const {
  verificarAutenticacion,
} = require('../middlewares/verificarAutenticacion');
const { verificarPermisos } = require('../middlewares/verificarPermisos');

const router = Router();

router.post(
  '/',
  [verificarAutenticacion, verificarPermisos],
  crearRecursoDigital
);
router.get('/', obtenerRecursosDigitales);
router.put(
  '/:id',
  [verificarAutenticacion, verificarPermisos],
  modificarRecursoDigital
);
router.delete(
  '/:id',
  [verificarAutenticacion, verificarPermisos],
  eliminarRecursoDigital
);

module.exports = router;
