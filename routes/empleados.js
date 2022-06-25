const { Router } = require('express');
const {
  crearEmpleado,
  obtenerEmpleados,
  modificarEmpleado,
  eliminarEmpleado,
  obtenerEmpleadoPorId,
} = require('../controllers/empleados');

const router = Router();

router.post('/', crearEmpleado);
router.get('/', obtenerEmpleados);
router.get('/:id', obtenerEmpleadoPorId);
router.put('/:id', modificarEmpleado);
router.delete('/:id', eliminarEmpleado);

module.exports = router;
