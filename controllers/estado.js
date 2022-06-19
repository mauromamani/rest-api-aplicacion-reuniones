const { response } = require('express');
const Estado = require('../models/Estado');


/**
 * @method POST
 * @name crearEstado
 * @body {nombreEstado: string}
 */
const crearEstado = async (req, res = response) => {
  const data = req.body;

  try {
    const nuevoEstado = new Estado(data);
    await nuevoEstado.save();

    res.status(201).json({
      status: 201,
      message: 'Estado creado con exito',
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
 * @name obtenerEstados
 */
const obtenerEstados = async (req, res = response) => {
  try {
    const estados = await Estado.find();

    res.status(200).json({
      status: 200,
      data: { estados },
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
 * @name modificarEstado
 * @body {estado: string}
 * @params { id: string }
 */
const modificarEstado = async (req, res = response) => {
  const { id } = req.params;
  const { _id, ...data } = req.body;

  try {
    const estado = await Estado.findByIdAndUpdate(id, data);
    if (!estado) {
      res.status(404).json({
        status: 404,
        message: 'estado no encontrado',
      });
      return;
    }

    res.status(200).json({
      status: 200,
      message: 'estado modificado con exito',
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
 * @name eliminarEstado
 * @params { id: string }
 */
const eliminarEstado = async (req, res = response) => {
  const { id } = req.params;

  try {
    const estado = await Estado.findById(id);
    if (!estado) {
      res.status(404).json({
        status: 404,
        message: 'estado no encontrado',
      });
      return;
    }

    await Estado.deleteOne({ id });

    res.status(200).json({
      status: 200,
      message: 'estado eliminado con exito',
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
  crearEstado,
  obtenerEstados,
  modificarEstado,
  eliminarEstado,
};
