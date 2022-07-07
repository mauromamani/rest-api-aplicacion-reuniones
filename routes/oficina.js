const { Router } = require('express');
const {
  crearOficina,
  modificarOficina,
  obtenerOficinas,
  eliminarOficina,
  obtenerEstadisticasOficinas,
  obtenerOficinasLibres,
} = require('../controllers/oficina');
const {
  verificarAutenticacion,
} = require('../middlewares/verificarAutenticacion');
const { verificarPermisos } = require('../middlewares/verificarPermisos');
const router = Router();

router.post('/', [verificarAutenticacion, verificarPermisos], crearOficina);
router.get('/', obtenerOficinas);
router.get('/libres', obtenerOficinasLibres);
router.get('/estadisticas/', obtenerEstadisticasOficinas);
router.put(
  '/:id',
  [verificarAutenticacion, verificarPermisos],
  modificarOficina
);
router.delete(
  '/:id',
  [verificarAutenticacion, verificarPermisos],
  eliminarOficina
);

module.exports = router;
