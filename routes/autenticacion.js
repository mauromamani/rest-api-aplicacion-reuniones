const { Router } = require('express');
const { iniciarSesion } = require('../controllers/autenticacion');

const router = Router();

router.post('/login', iniciarSesion);

module.exports = router;
