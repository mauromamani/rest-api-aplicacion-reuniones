const { response } = require('express');
const Recurso = require('../models/Recurso');

/**
 * @method POST
 * @name crearRecurso
 * @body { nombre: string, estaReservado: boolean }
 */
const crearRecurso = async (req, res = response) => {
  const data = req.body;

  try {
    const nuevoRecurso = new Recurso(data);
    await nuevoRecurso.save();

    res.status(201).json({
      status: 201,
      message: 'recurso creado con exito',
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
 * @name obtenerRecursos
 * @query { estaReservado: boolean }
 */
const obtenerRecursos = async (req, res = response) => {
  const { estaReservado } = req.query;
  let query = {};

  if (estaReservado) {
    query.estaReservado = estaReservado;
  }

  try {
    const recursos = await Recurso.find(query);

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
 * @name modificarRecurso
 * @body { nombre: string, estaReservado: boolean }
 * @params { id: string }
 */
const modificarRecurso = async (req, res = response) => {
  const { id } = req.params;
  const { _id, ...data } = req.body;

  try {
    const recurso = await Recurso.findByIdAndUpdate(id, data);
    if (!recurso) {
      res.status(404).json({
        status: 404,
        message: 'recurso no encontrado',
      });
      return;
    }

    res.status(200).json({
      status: 200,
      message: 'recurso modificado con exito',
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
 * @name eliminarRecurso
 * @params { id: string }
 */
const eliminarRecurso = async (req, res = response) => {
  const { id } = req.params;

  try {
    const recurso = await Recurso.findById(id);
    if (!recurso) {
      res.status(404).json({
        status: 404,
        message: 'recurso no encontrado',
      });
      return;
    }

    await Recurso.deleteOne({ id });

    res.status(200).json({
      status: 200,
      message: 'recurso eliminado con exito',
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
  crearRecurso,
  obtenerRecursos,
  modificarRecurso,
  eliminarRecurso,
};
