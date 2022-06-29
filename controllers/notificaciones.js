const { response } = require('express');
const Notificacion = require('../models/Notificacion');

/**
 * @method GET
 * @name obtenerNotificaciones
 * @query { empleado: Empleado }
 */
const obtenerNotificaciones = async (req, res = response) => {
  const { empleado } = req.query;
  let query = {};

  if (empleado) {
    query.empleado = empleado;
  }

  try {
    const notificaciones = await Notificacion.find(query);

    res.status(200).json({
      status: 200,
      data: { notificaciones },
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      status: 500,
      message: 'internal server error',
    });
  }
};

/**
 * @method GET
 * @name obtenerNotificacionPorId
 */
const obtenerNotificacionPorId = async (req, res = response) => {
  const { id } = req.params;

  try {
    const notificacion = await Notificacion.findById(id);
    if (!notificacion) {
      return res.status(404).json({
        status: 404,
        message: 'notificacion no encontrada',
      });
    }

    res.status(200).json({
      status: 200,
      data: { notificacion },
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      status: 500,
      message: 'internal server error',
    });
  }
};

module.exports = { obtenerNotificaciones, obtenerNotificacionPorId };
