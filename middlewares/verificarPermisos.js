const Empleado = require('../models/Empleado');

const verificarPermisos = async (req, res, next) => {
  const { uid } = req;

  // verificar que existe un id en la req
  if (!uid) {
    return res.status(401).json({
      status: 401,
      message: 'no existe empleado autenticado',
    });
  }

  // verificar que existe un empleado
  const empleado = await Empleado.findById(uid);
  if (!empleado) {
    return res.status(401).json({
      status: 401,
      message: 'no existe empleado',
    });
  }

  // verificar si un empleado posee el rol de ADMINISTRADOR
  if (empleado.rol !== 'ADMINISTRADOR') {
    return res.status(401).json({
      status: 401,
      message: 'no posee los permisos necesarios para realizar esta accion',
    });
  }

  next();
};

module.exports = { verificarPermisos };
