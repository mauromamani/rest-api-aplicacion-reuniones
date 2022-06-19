const { Router } = require('express');
const {
  crearRecursoDigital,
  obtenerRecursosDigitales,
  modificarRecursoDigital,
  eliminarRecursoDigital,
} = require('../controllers/recursosDigitales');

const router = Router();

router.post('/', crearRecursoDigital);
router.get('/', obtenerRecursosDigitales);
router.put('/:id', modificarRecursoDigital);
router.delete('/:id', eliminarRecursoDigital);

module.exports = router;
