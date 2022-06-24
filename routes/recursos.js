const { Router } = require('express');
const {
  crearRecurso,
  obtenerRecursos,
  modificarRecurso,
  eliminarRecurso,
} = require('../controllers/recursos');
const {
  verificarAutenticacion,
} = require('../middlewares/verificarAutenticacion');
const { verificarPermisos } = require('../middlewares/verificarPermisos');

const router = Router();

router.post('/', [verificarAutenticacion, verificarPermisos], crearRecurso);
router.get('/', obtenerRecursos);
router.put(
  '/:id',
  [verificarAutenticacion, verificarPermisos],
  modificarRecurso
);
router.delete(
  '/:id',
  [verificarAutenticacion, verificarPermisos],
  eliminarRecurso
);

module.exports = router;
