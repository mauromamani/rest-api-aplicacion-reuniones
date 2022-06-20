const { Router } = require('express');
const {
  crearOficina,
  modificarOficina,
  obtenerOficinas,
  eliminarOficina,
} = require('../controllers/oficina');
const router = Router();

router.post('/', crearOficina);
router.get('/', obtenerOficinas);
router.put('/:id', modificarOficina);
router.delete('/:id', eliminarOficina);

module.exports = router;