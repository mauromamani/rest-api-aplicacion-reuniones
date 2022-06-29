const { response } = require('express');
const Reunion = require('../models/Reunion');
const Recurso = require('../models/Recurso');
const Empleado = require('../models/Empleado');
const Oficina = require('../models/Oficina');
const Notificacion = require('../models/Notificacion');

/**
 * @method POST
 * @name crearReunion
 * @body { 
    horaInicio: date,
    horaFinal: date,
    participantes?: Empleado[],
    recursos?: Recurso[],
    recursosDigitales?: RecursoDigital[],
    estaEnReunion?: boolean,
    prioridad: Prioridad
    tipoReunion: TipoReunion
    oficina: Oficina
    estado: Estado 
   }
 */
const crearReunion = async (req, res = response) => {
  const data = req.body;

  try {
    const nuevaReunion = new Reunion(data);

    // cambiar el estado de los recursos ocupados
    if (!!data.recursos.length) {
      await Recurso.updateMany(
        { _id: { $in: data.recursos } },
        { $set: { estaReservado: true } }
      );
    }

    // cambiar el estado de la oficina ocupada
    const oficina = await Oficina.findByIdAndUpdate(data.oficina, {
      estaOcupada: true,
    });
    if (!oficina) {
      return res.status(404).json({
        status: 404,
        message: 'oficina no encontrada',
      });
    }

    // cambiar el estado de los participantes
    if (!!data.participantes.length) {
      await Empleado.updateMany(
        { _id: { $in: data.participantes } },
        { $set: { estaEnReunion: true } }
      );
    }

    await nuevaReunion.save();

    res.status(201).json({
      status: 201,
      message: 'reunion creada con exito',
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
 * @name obtenerReuniones
 * @query { estaDeshabilitada: boolean }
 */
const obtenerReuniones = async (req, res = response) => {
  const { estaDeshabilitada } = req.query;
  let query = {};

  if (estaDeshabilitada) {
    query.estaDeshabilitada = estaDeshabilitada;
  }

  try {
    const reuniones = await Reunion.find(query)
      .populate('participantes')
      .populate('recursos')
      .populate('recursosDigitales')
      .populate('prioridad')
      .populate('tipoReunion')
      .populate('oficina')
      .populate('estado');

    res.status(200).json({
      status: 200,
      data: { reuniones },
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
 * @name obtenerReunionPorId
 * @params { id: string }
 */
const obtenerReunionPorId = async (req, res = response) => {
  const { id } = req.params;

  try {
    const reunion = await Reunion.findById(id)
      .populate('participantes')
      .populate('recursos')
      .populate('recursosDigitales')
      .populate('prioridad')
      .populate('tipoReunion')
      .populate('oficina')
      .populate('estado');
    if (!reunion) {
      return res.status(404).json({
        status: 404,
        message: 'reunion no encontrada',
      });
    }

    res.status(200).json({
      status: 200,
      data: { reunion },
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
 * @name modificarReunion
 * @params { id: string }
 * @body { 
    horaInicio?: date,
    horaFinal?: date,
    participantes?: Empleado[],
    recursos?: Recurso[],
    recursosDigitales?: RecursoDigital[],
    estaEnReunion?: boolean,
    prioridad?: Prioridad
    tipoReunion?: TipoReunion
    oficina?: Oficina
   }
 */
const modificarReunion = async (req, res = response) => {
  const { id } = req.params;
  const { _id, ...data } = req.body;

  try {
    // TODO: Mejorar logica
    const reunion = await Reunion.findById(id);
    if (!reunion) {
      return res.status(404).json({
        status: 404,
        message: 'reunion no encontrada',
      });
    }

    // reestablecemos estados de recursos
    if (!!reunion.recursos.length) {
      await Recurso.updateMany(
        { _id: { $in: reunion.recursos } },
        { $set: { estaReservado: false } }
      );
    }

    // reestablecemos estados de participantes
    if (!!reunion.participantres.length) {
      await Empleado.updateMany(
        { _id: { $in: reunion.participantres } },
        { $set: { estaEnReunion: false } }
      );
    }

    // reestablecemos estado de oficina
    await Oficina.findByIdAndUpdate(reunion.oficina, { estaOcupada: false });

    // modificar la reunion y cambiar los estados
    await Reunion.findByIdAndUpdate(id, data);

    // cambiar el estado de los recursos ocupados
    if (!!data.recursos.length) {
      await Recurso.updateMany(
        { _id: { $in: data.recursos } },
        { $set: { estaReservado: true } }
      );
    }

    // TODO: Cambiar el estado de la oficina ocupada
    await Oficina.findByIdAndUpdate(data.oficina, { estaOcupada: true });

    // cambiar el estado de los participantes
    if (!!data.participantes.length) {
      await Empleado.updateMany(
        { _id: { $in: data.participantes } },
        { $set: { estaEnReunion: true } }
      );
    }

    res.status(201).json({
      status: 201,
      message: 'reunion modificada con exito',
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
 * @name eliminarReunion
 * @params { id: string }
 * @description no se va a eliminar la reunion sino que va a cambiar el estado "estaDeshabilitada" a true, para mantener un registro
 */
const eliminarReunion = async (req, res = response) => {
  const { id } = req.params;

  try {
    const reunion = await Reunion.findByIdAndUpdate(id, {
      estaDeshabilitada: true,
    });
    if (!reunion) {
      return res.status(404).json({
        status: 404,
        message: 'reunion no encontrada',
      });
    }

    // cambiar el estado de los recursos ocupados
    if (!!reunion.recursos.length) {
      await Recurso.updateMany(
        { _id: { $in: reunion.recursos } },
        { $set: { estaReservado: false } }
      );
    }

    // cambiar el estado de la oficina ocupada
    await Oficina.findByIdAndUpdate(reunion.oficina, { estaOcupada: false });

    // cambiar el estado de los participantes
    if (!!reunion.participantes.length) {
      await Empleado.updateMany(
        { _id: { $in: reunion.participantes } },
        { $set: { estaEnReunion: false } }
      );
    }

    res.status(201).json({
      status: 201,
      message: 'reunion eliminada con exito',
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
 * @method POST
 * @name confirmarReunion
 * @params { id: string }
 */
const confirmarReunion = async (req, res = response) => {
  const { id } = req.params;

  try {
    const reunion = await Reunion.findById(id);
    if (!reunion) {
      return res.status(404).json({
        status: 404,
        message: 'reunion no encontrada',
      });
    }

    const empleados = await Empleado.find({ _id: { $in: reunion.empleados } });

    // creamos un arreglo de notificaciones: { empleado: empleadoId, reunion: reunionId }
    let notificaciones = empleados.map((empleado) => ({
      empleado: empleado._id,
      reunion: reunion._id,
    }));

    // guardamos en una sola instancia el arreglo de notificaciones
    notificaciones = await Notificacion.create(notificaciones);

    // realizar envio de mensajes
    res.status(200).json({
      status: 200,
      message: 'la reunion fue confirmada',
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
  crearReunion,
  modificarReunion,
  obtenerReuniones,
  obtenerReunionPorId,
  eliminarReunion,
  confirmarReunion,
};
