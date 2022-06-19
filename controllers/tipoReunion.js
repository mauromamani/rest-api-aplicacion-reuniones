const { response } = require('express');
const TipoReunion = require('../models/TipoReunion');

/**
 * @method POST
 * @name crearTipoReunion
 * @body {tipoReunion: string}
 */
const crearTipoReunion = async (req, res = response) => {
  const data = req.body;

  try {
    const nuevoTipoReunion = new TipoReunion(data);
    await nuevoTipoReunion.save();

    res.status(201).json({
      status: 201,
      message: 'Tipo de Reunion creado con exito',
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
 * @name obtenerTiposReunion
 */
const obtenerTiposReunion = async (req, res = response) => {
  try {
    const tiposReunion = await TipoReunion.find();

    res.status(200).json({
      status: 200,
      data: { tiposReunion },
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
 * @name modificarTipoReunion
 * @body {tipoReunion: string}
 * @params { id: string }
 */
const modificarTipoReunion = async (req, res = response) => {
  const { id } = req.params;
  const { _id, ...data } = req.body;

  try {
    const tipoReunion = await TipoReunion.findByIdAndUpdate(id, data);
    if (!tipoReunion) {
      res.status(404).json({
        status: 404,
        message: 'tipo de reunion no encontrado',
      });
      return;
    }

    res.status(200).json({
      status: 200,
      message: 'tipo de reunion modificado con exito',
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
 * @name eliminarTipoReunion
 * @params { id: string }
 */
const eliminarTipoReunion = async (req, res = response) => {
  const { id } = req.params;

  try {
    const tipoReunion = await TipoReunion.findById(id);
    if (!tipoReunion) {
      res.status(404).json({
        status: 404,
        message: 'tipo de reunion no encontrado',
      });
      return;
    }

    await TipoReunion.deleteOne({ id });

    res.status(200).json({
      status: 200,
      message: 'Tipo de Reunion eliminado con exito',
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
  crearTipoReunion,
  obtenerTiposReunion,
  modificarTipoReunion,
  eliminarTipoReunion,
};
