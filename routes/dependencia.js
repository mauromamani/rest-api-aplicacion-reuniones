const { Router } = require('express');
const {
  crearDependencia,
  modificarDependencia,
  obtenerDependencias,
  eliminarDependencia,
} = require('../controllers/dependencia');
const router = Router();

router.post('/', crearDependencia);
router.get('/', obtenerDependencias);
router.put('/:id', modificarDependencia);
router.delete('/:id', eliminarDependencia);

module.exports = router;