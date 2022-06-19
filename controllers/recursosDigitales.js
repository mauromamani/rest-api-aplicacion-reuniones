const { response } = require('express');
const RecursoDigital = require('../models/RecursoDigital');

/**
 * @method POST
 * @name crearRecursoDigital
 * @body { nombre: string, recurso: string }
 */
const crearRecursoDigital = async (req, res = response) => {
  const data = req.body;

  try {
    const nuevoRecurso = new RecursoDigital(data);
    await nuevoRecurso.save();

    res.status(201).json({
      status: 201,
      message: 'recurso digital creado con exito',
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
 * @name obtenerRecursosDigitales
 */
const obtenerRecursosDigitales = async (req, res = response) => {
  try {
    const recursos = await RecursoDigital.find();

    res.status(200).json({
      status: 200,
      data: { recursos },
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
 * @name modificarRecursoDigital
 * @body { nombre: string, recurso: string }
 * @params { id: string }
 */
const modificarRecursoDigital = async (req, res = response) => {
  const { id } = req.params;
  const { _id, ...data } = req.body;

  try {
    const recurso = await RecursoDigital.findByIdAndUpdate(id, data);
    if (!recurso) {
      res.status(404).json({
        status: 404,
        message: 'recurso digital no encontrado',
      });
      return;
    }

    res.status(200).json({
      status: 200,
      message: 'recurso digital modificado con exito',
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
 * @name eliminarRecursoDigital
 * @params { id: string }
 */
const eliminarRecursoDigital = async (req, res = response) => {
  const { id } = req.params;

  try {
    const recurso = await RecursoDigital.findByIdAndDelete(id);
    if (!recurso) {
      res.status(404).json({
        status: 404,
        message: 'recurso digital no encontrado',
      });
      return;
    }

    res.status(200).json({
      status: 200,
      message: 'recurso digital eliminado con exito',
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
  crearRecursoDigital,
  obtenerRecursosDigitales,
  modificarRecursoDigital,
  eliminarRecursoDigital,
};
