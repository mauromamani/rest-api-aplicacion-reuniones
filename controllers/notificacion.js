const { response } = require('express');
const Empleado = require('../models/Empleado');
const Notificacion = require('../models/Notificacion');
const Reunion = require('../models/Reunion');

/**
 * @method POST
 * @name crearNotificacion
 * @body {empleado: EmpleadoID, reunion: ReunionID}
 */
const crearNotificacion = async (req, res = response) => {
  const data = req.body;


  try {
    //Verificar que la reunion exista
    const reunion = await Reunion.findById(data.reunion);
    if (!reunion) {
      res.status(400).json({
        status: 400,
        message: 'la reunion no existe',
      });
      return;
    }

    // Verificar que el empleado exista
    const empleado = await Empleado.findById(data.empleado);
    if (!empleado) {
      res.status(400).json({
        status: 400,
        message: 'el empleado no existe',
      });
      return;
    }


    const nuevaNotificacion = new Notificacion(data);
    await nuevaNotificacion.save();

    res.status(201).json({
      status: 201,
      message: 'Notificacion creada con exito',
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
 * @name obtenerNotificaciones
 */
const obtenerNotificaciones = async (req, res = response) => {

  try {
    const notificaciones = await Notificacion.find();

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
 * @method PUT
 * @name modificarNotificacion
 * @body { empleado: EmpleadoID, reunion: ReunionID}
 * @params { id: string }
 */
const modificarNotificacion = async (req, res = response) => {
  const { id } = req.params;
  const { _id, ...data } = req.body;

  try {

    //Verificar que la reunion exista
    const reunion = await Reunion.findById(data.reunion);
    if (!reunion) {
      res.status(400).json({
        status: 400,
        message: 'la reunion no existe',
      });
      return;
    }

    // Verificar que el empleado exista
    const empleado = await Empleado.findById(data.empleado);
    if (!empleado) {
      res.status(400).json({
        status: 400,
        message: 'el empleado no existe',
      });
      return;
    }

    const notificacion = await Notificacion.findByIdAndUpdate(id, data);
    if (!notificacion) {
      res.status(404).json({
        status: 404,
        message: 'notificacion no encontrada',
      });
      return;
    }

    res.status(200).json({
      status: 200,
      message: 'notificacion modificada con exito',
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
 * @method DELETE
 * @name eliminarNotificacion
 * @params { id: string }
 */
const eliminarNotificacion = async (req, res = response) => {
  const { id } = req.params;

  try {
    const notificacion = await Notificacion.findById(id);
    if (!notificacion) {
      res.status(404).json({
        status: 404,
        message: 'notificacion no encontrada',
      });
      return;
    }

    await Notificacion.deleteOne({ id });

    res.status(200).json({
      status: 200,
      message: 'notificacion eliminada con exito',
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      status: 500,
      message: 'internal server error',
    });
  }
};

module.exports = {
  crearNotificacion,
  obtenerNotificaciones,
  modificarNotificacion,
  eliminarNotificacion,
};
