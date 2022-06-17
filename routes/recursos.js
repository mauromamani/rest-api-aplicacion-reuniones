const { Router } = require('express');
const {
  crearRecurso,
  obtenerRecursos,
  modificarRecurso,
  eliminarRecurso,
} = require('../controllers/recursos');

const router = Router();

router.post('/recursos', crearRecurso);
router.get('/recursos', obtenerRecursos);
router.put('/recursos/:id', modificarRecurso);
router.delete('/recursos/:id', eliminarRecurso);

module.exports = router;
