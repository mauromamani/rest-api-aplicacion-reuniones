const { Router } = require('express');
const {
  crearTipoReunion,
  modificarTipoReunion,
  obtenerTiposReunion,
  eliminarTipoReunion,
} = require('../controllers/tipoReunion');
const router = Router();

router.post('/', crearTipoReunion);
router.get('/', obtenerTiposReunion);
router.put('/:id', modificarTipoReunion);
router.delete('/:id', eliminarTipoReunion);

module.exports = router;