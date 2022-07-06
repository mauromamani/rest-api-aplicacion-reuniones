const { response } = require('express');
const Dependencia = require('../models/Dependencia');

/**
 * @method POST
 * @name crearDependencia
 * @body { tipo: string }
 */
const crearDependencia = async (req, res = response) => {
  const data = req.body;

  try {
    const nuevaDependencia = new Dependencia(data);
    await nuevaDependencia.save();

    res.status(201).json({
      status: 201,
      message: 'dependencia creada con exito',
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
 * @name obtenerDependencias
 */
const obtenerDependencias = async (req, res = response) => {
  try {
    const dependencias = await Dependencia.find();

    res.status(200).json({
      status: 200,
      data: { dependencias },
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
 * @name modificarDependencia
 * @body { tipo: string }
 * @params { id: string }
 */
const modificarDependencia = async (req, res = response) => {
  const { id } = req.params;
  const { _id, ...data } = req.body;

  try {
    const dependencia = await Dependencia.findByIdAndUpdate(id, data);
    if (!dependencia) {
      res.status(404).json({
        status: 404,
        message: 'dependencia no encontrada',
      });
      return;
    }

    res.status(200).json({
      status: 200,
      message: 'dependencia modificada con exito',
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
 * @name eliminarDependencia
 * @params { id: string }
 */
const eliminarDependencia = async (req, res = response) => {
  const { id } = req.params;

  try {
    const dependencia = await Dependencia.findByIdAndDelete(id);
    if (!dependencia) {
      res.status(404).json({
        status: 404,
        message: 'dependencia no encontrada',
      });
      return;
    }

    res.status(200).json({
      status: 200,
      message: 'dependencia eliminada con exito',
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
  crearDependencia,
  obtenerDependencias,
  modificarDependencia,
  eliminarDependencia,
};
