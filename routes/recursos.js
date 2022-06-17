const { Router } = require('express');
const {
  crearRecurso,
  obtenerRecursos,
  modificarRecurso,
  eliminarRecurso,
} = require('../controllers/recursos');

const router = Router();

router.post('/', crearRecurso);
router.get('/', obtenerRecursos);
router.put('/:id', modificarRecurso);
router.delete('/:id', eliminarRecurso);

module.exports = router;
