const { response } = require('express');
const Oficina = require('../models/Oficina');

/**
 * @method POST
 * @name crearOficina
 * @body { nombre: string, estaOcupada?: boolean }
 */
const crearOficina = async (req, res = response) => {
  const data = req.body;

  try {
    const nuevaOficina = new Oficina(data);
    await nuevaOficina.save();

    res.status(201).json({
      status: 201,
      message: 'oficina creada con exito',
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
 * @name obtenerOficinas
 * @query { estaOcupada: boolean }
 */
const obtenerOficinas = async (req, res = response) => {
  const { estaOcupada } = req.query;
  let query = {};

  if (estaOcupada) {
    query.estaOcupada = estaOcupada;
  }

  try {
    const oficinas = await Oficina.find(query)
      .populate('reunionesActivas')
      .populate('historialDeReuniones');

    res.status(200).json({
      status: 200,
      data: { oficinas },
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
 * @name modificarOficina
 * @body { nombre: string, estaOcupada: boolean, reunion: ReunionID }
 * @params { id: string }
 */
const modificarOficina = async (req, res = response) => {
  const { id } = req.params;
  const { _id, ...data } = req.body;

  try {
    const oficina = await Oficina.findByIdAndUpdate(id, data);
    if (!oficina) {
      res.status(404).json({
        status: 404,
        message: 'oficina no encontrada',
      });
      return;
    }

    res.status(200).json({
      status: 200,
      message: 'oficina modificada con exito',
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
 * @name eliminarOficina
 * @params { id: string }
 */
const eliminarOficina = async (req, res = response) => {
  const { id } = req.params;

  try {
    const oficina = await Oficina.findById(id);
    if (!oficina) {
      res.status(404).json({
        status: 404,
        message: 'oficina no encontrada',
      });
      return;
    }

    await Oficina.deleteOne({ id });

    res.status(200).json({
      status: 200,
      message: 'oficina eliminada con exito',
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
  crearOficina,
  modificarOficina,
  obtenerOficinas,
  eliminarOficina,
};
