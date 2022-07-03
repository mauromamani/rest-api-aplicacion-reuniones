const { response } = require('express');
const Empleado = require('../models/Empleado');
const { generarJWT } = require('../utils/jwt');

/**
 * @method POST
 * @name iniciarSesion
 * @body { email: string, clave: string }
 */
const iniciarSesion = async (req, res = response) => {
  const data = req.body;
  try {
    const empleado = await Empleado.findOne({ email: data.email }).populate(
      'dependencias'
    );
    if (!empleado) {
      res.status(401).json({
        status: 401,
        message: 'email o clave incorrectos',
      });
      return;
    }

    if (empleado.clave !== data.clave) {
      res.status(401).json({
        status: 401,
        message: 'email o clave incorrectos',
      });
      return;
    }

    const token = await generarJWT(empleado._id);

    res.status(200).json({
      status: 200,
      data: { empleado, token },
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      status: 500,
      message: 'internal server error',
    });
  }
};

module.exports = { iniciarSesion };
