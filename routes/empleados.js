const { Router } = require('express');
const {
  crearEmpleado,
  obtenerEmpleados,
  modificarEmpleado,
  eliminarEmpleado,
} = require('../controllers/empleados');
const {
  verificarAutenticacion,
} = require('../middlewares/verificarAutenticacion');
const { verificarPermisos } = require('../middlewares/verificarPermisos');

const router = Router();

router.post('/', [verificarAutenticacion, verificarPermisos], crearEmpleado);
router.get('/', [verificarAutenticacion, verificarPermisos], obtenerEmpleados);
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
