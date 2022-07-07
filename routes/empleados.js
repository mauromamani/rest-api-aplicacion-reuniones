const { Router } = require('express');
const {
  crearEmpleado,
  obtenerEmpleados,
  modificarEmpleado,
  eliminarEmpleado,
  obtenerEmpleadoPorId,
  obtenerEmpleadosLibres,
} = require('../controllers/empleados');
const {
  verificarAutenticacion,
} = require('../middlewares/verificarAutenticacion');
const { verificarPermisos } = require('../middlewares/verificarPermisos');

const router = Router();

router.post('/', [verificarAutenticacion, verificarPermisos], crearEmpleado);
router.get('/', [verificarAutenticacion], obtenerEmpleados);
router.get('/libres', [verificarAutenticacion], obtenerEmpleadosLibres);
router.get('/:id', [verificarAutenticacion], obtenerEmpleadoPorId);
router.put(
  '/:id',
  [verificarAutenticacion, verificarPermisos],
  modificarEmpleado
);
router.delete(
  '/:id',
  [verificarAutenticacion, verificarPermisos],
  eliminarEmpleado
);

module.exports = router;
