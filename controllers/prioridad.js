const { response } = require('express');
const Prioridad = require('../models/Prioridad');

/**
 * @method POST
 * @name crearPrioridad
 * @body { tipoPrioridad: string }
 */
const crearPrioridad = async (req, res = response) => {
  const data = req.body;
  data.tipoPrioridad = data.tipoPrioridad.toUpperCase().trim();

  try {
    const nuevaPrioridad = new Prioridad(data);
    await nuevaPrioridad.save();

    res.status(201).json({
      status: 201,
      message: 'Prioridad creada con exito',
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
 * @name obtenerPrioridades
 */
const obtenerPrioridades = async (req, res = response) => {
  try {
    const prioridades = await Prioridad.find();

    res.status(200).json({
      status: 200,
      data: { prioridades },
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
 * @name modificarPrioridad
 * @body { tipoPrioridad: string }
 * @params { id: string }
 */
const modificarPrioridad = async (req, res = response) => {
  const { id } = req.params;
  const { _id, ...data } = req.body;

  try {
    const prioridad = await Prioridad.findByIdAndUpdate(id, data);
    if (!prioridad) {
      res.status(404).json({
        status: 404,
        message: 'Prioridad no encontrada',
      });
      return;
    }

    res.status(200).json({
      status: 200,
      message: 'Prioridad modificada con exito',
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
 * @name eliminarPrioridad
 * @params { id: string }
 */
const eliminarPrioridad = async (req, res = response) => {
  const { id } = req.params;

  try {
    const prioridad = await Prioridad.findById(id);
    if (!prioridad) {
      res.status(404).json({
        status: 404,
        message: 'Prioridad no encontrada',
      });
      return;
    }

    await Prioridad.deleteOne({ id });

    res.status(200).json({
      status: 200,
      message: 'Prioridad eliminada con exito',
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
  crearPrioridad,
  obtenerPrioridades,
  modificarPrioridad,
  eliminarPrioridad,
};
