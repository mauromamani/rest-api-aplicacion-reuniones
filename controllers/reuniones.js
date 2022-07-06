const { response } = require('express');
const Reunion = require('../models/Reunion');
const Recurso = require('../models/Recurso');
const Estado = require('../models/Estado');
const Prioridad = require('../models/Prioridad');
const Empleado = require('../models/Empleado');
const Oficina = require('../models/Oficina');
const Notificacion = require('../models/Notificacion');
const emailer = require('../utils/emailer');
const { default: mongoose } = require('mongoose');

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
    const estadoPendiente = await Estado.findOne({
      nombreEstado: { $regex: 'Pendiente', $options: 'i' },
    });

    let nuevaReunion = new Reunion(data);
    nuevaReunion.estado = estadoPendiente._id;

    // TODO: Asignar estado por defecto
    // TODO: La lógica acá no sirve
    // if (!!data.recursos.length) {
    //   await Recurso.updateMany(
    //     { _id: { $in: data.recursos } },
    //     { $set: { estaReservado: true } }
    //   );
    // }

    // verificar que la oficina exista
    const oficina = await Oficina.findById(data.oficina);
    if (!oficina) {
      return res.status(404).json({
        status: 404,
        message: 'oficina no encontrada',
      });
    }

    // buscamos las reuniones activas a partir de la oficina seleccionada
    let reunionesActivas = await Reunion.find({
      _id: { $in: oficina.reunionesActivas },
    }).populate('prioridad');

    // vamos la prioridad de la nueva reunion, y si es ALTA podemos sustituir a una reunion
    nuevaReunion = await nuevaReunion.populate('prioridad');
    const nuevaReunionPrioridad = nuevaReunion.prioridad.tipoPrioridad;

    // se transforma a milisegundos a las fechas de inicio y final de la nueva reunion
    const reunionHoraInicio = new Date(nuevaReunion.horaInicio).getTime();
    const reunionHoraFinal = new Date(nuevaReunion.horaFinal).getTime();

    // verificar que la hora de inicio no sea mayor a hora de final
    if (reunionHoraInicio > reunionHoraFinal) {
      res.status(400).json({
        status: 400,
        message: 'la hora de inicio no puede ser mayor a la hora de final',
      });
      return;
    }

    // verificar que la reunion no sea a la misma hora
    if (reunionHoraInicio === reunionHoraFinal) {
      return res.status(400).json({
        status: 400,
        message: 'las reuniones no pueden comenzar y terminar al mismo tiempo',
      });
    }

    // verificar que la reunion no sea de menos de 15 minutos
    if (reunionHoraFinal - reunionHoraInicio < 900000) {
      return res.status(400).json({
        status: 400,
        message: 'las reuniones deben durar al menos 15 minutos',
      });
    }

    // si existen reuniones activas en la oficina vamos a verificar
    // que no existan colisiones entre horarios
    let existeColision = false;
    let fueReprogramada = false;
    let reunionQueColisiona = null;
    if (!!reunionesActivas.length) {
      reunionesActivas.forEach((r) => {
        // convertimos a milisegundos de horaInicio y horaFinal de CADA elemento de reunionesActivas
        const rHoraInicio = new Date(r.horaInicio).getTime(); // le asignamos 10 minutos de ventaja
        const rHoraFinal = new Date(r.horaFinal).getTime();

        // vamos a verificar que "reunionHoraInicio" no sea igual o este entre los rangos
        // de fecha de CADA elemento de reunionesActivas
        if (
          (reunionHoraInicio >= rHoraInicio &&
            reunionHoraInicio <= rHoraFinal) ||
          (reunionHoraFinal >= rHoraInicio && reunionHoraFinal <= rHoraFinal) ||
          (rHoraInicio >= reunionHoraInicio && rHoraInicio <= reunionHoraFinal)
        ) {
          // si la prioridad de la nueva reunion es ALTA podemos reprogramar una reunion;
          if (
            nuevaReunionPrioridad === 'ALTA' &&
            r.prioridad.tipoPrioridad !== 'ALTA'
          ) {
            fueReprogramada = true;
            reunionQueColisiona = r;
            return;
          }

          existeColision = true;
          reunionQueColisiona = r;
          return;
        }
      });
    }

    // si la reunion es de prioridad alta
    if (fueReprogramada) {
      const estadoSuspendida = await Estado.findOne({
        nombreEstado: { $regex: 'Suspendida', $options: 'i' },
      });

      reunionQueColisiona = await Reunion.findByIdAndUpdate(
        reunionQueColisiona._id,
        { estado: estadoSuspendida._id }
      );

      oficina.reunionesActivas.push(nuevaReunion._id);
      // eliminamos a la reunion para reprogramar de reunionesActivas
      oficina.reunionesActivas = oficina.reunionesActivas.filter(
        (r) => r._id.toString() !== reunionQueColisiona._id.toString()
      );
      oficina.historialDeReuniones.push(nuevaReunion._id);

      await oficina.save();

      await nuevaReunion.save();

      // ENVIAR MENSAJE DE REPROGRAMACION

      return res.status(200).json({
        status: 200,
        message:
          'reunion fue creada con exito. La siguiente reunion tendra que ser reprogramada',
        reunionReprogramada: reunionQueColisiona,
      });
    }

    // existe una colision de fechas
    if (existeColision) {
      reunionQueColisiona = await Reunion.findById(reunionQueColisiona._id)
        .populate('tipoReunion')
        .populate('estado')
        .populate('prioridad');

      return res.status(400).json({
        status: 400,
        message: 'existe una reunion en ese rango de horario',
        reunionQueColisiona,
      });
    }

    oficina.historialDeReuniones.push(nuevaReunion._id);
    oficina.reunionesActivas.push(nuevaReunion._id);

    await oficina.save();

    // TODO: la logica acá no sirve
    // if (!!data.participantes.length) {
    //   await Empleado.updateMany(
    //     { _id: { $in: data.participantes } },
    //     { $set: { estaEnReunion: true } }
    //   );
    // }

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
 * @query { estaDeshabilitada: boolean, estado: Estado, oficina: Oficina, participantes: Participante[], legajo: number }
 */
const obtenerReuniones = async (req, res = response) => {
  let {
    estaDeshabilitada,
    estado,
    oficina,
    horaInicio,
    horaFinal,
    participantes,
    legajo,
  } = req.query;
  let query = {};

  if (estaDeshabilitada) {
    query.estaDeshabilitada = estaDeshabilitada;
  }

  if (estado) {
    query.estado = estado;
  }

  if (oficina) {
    query.oficina = oficina;
  }

  if (horaInicio && horaFinal) {
    query.horaInicio = { $gte: horaInicio };
    query.horaFinal = { $lt: horaFinal };
  }

  if (participantes) {
    participantes = JSON.parse(participantes);
    participantes = participantes.map((p) => mongoose.Types.ObjectId(p));

    query.participantes = { $in: participantes };
  }

  try {
    let reuniones = await Reunion.find(query)
      .populate('participantes')
      .populate('recursos')
      .populate('recursosDigitales')
      .populate('tipoReunion')
      .populate('oficina')
      .populate('estado')
      .populate('prioridad');

    if (legajo) {
      reuniones = reuniones.filter((r) =>
        r.participantes.find((p) => p.legajo === legajo)
      );
    }

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
      .populate('tipoReunion')
      .populate('oficina')
      .populate('estado')
      .populate('prioridad');

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
    prioridad?: Prioridad
    tipoReunion?: TipoReunion
    oficina?: Oficina
    estado?: Estado
   }
 */
const modificarReunion = async (req, res = response) => {
  const { id } = req.params;
  const { _id, ...data } = req.body;

  try {
    let reunion = await Reunion.findById(id);
    if (!reunion) {
      return res.status(404).json({
        status: 404,
        message: 'reunion no encontrada',
      });
    }

    // verificar que la oficina exista
    const oficina = await Oficina.findById(data.oficina);
    if (!oficina) {
      return res.status(404).json({
        status: 404,
        message: 'oficina no encontrada',
      });
    }

    // buscamos las reuniones activas a partir de la oficina seleccionada
    let reunionesActivas = await Reunion.find({
      _id: { $in: oficina.reunionesActivas },
    }).populate('prioridad');

    // buscamos la prioridad mandada en el body
    const { tipoPrioridad } = await Prioridad.findById(data.prioridad);

    // se transforma a milisegundos a las fechas de inicio y final de la nueva reunion
    const reunionHoraInicio = new Date(data.horaInicio).getTime();
    const reunionHoraFinal = new Date(data.horaFinal).getTime();

    // verificar que la hora de inicio no sea mayor a hora de final
    if (reunionHoraInicio > reunionHoraFinal) {
      res.status(400).json({
        status: 400,
        message: 'la hora de inicio no puede ser mayor a la hora de final',
      });
      return;
    }

    // verificar que la reunion no sea a la misma hora
    if (reunionHoraInicio === reunionHoraFinal) {
      return res.status(400).json({
        status: 400,
        message: 'las reuniones no pueden comenzar y terminar al mismo tiempo',
      });
    }

    // verificar que la reunion no sea de menos de 15 minutos
    if (reunionHoraFinal - reunionHoraInicio < 900000) {
      return res.status(400).json({
        status: 400,
        message: 'las reuniones deben durar al menos 15 minutos',
      });
    }

    let existeColision = false;
    let fueReprogramada = false;
    let reunionQueColisiona = null;

    // quitamos la reunion del arreglo para evitar problemas de colision de fechas
    reunionesActivas = reunionesActivas.filter(
      (r) => r._id.toString() != reunion._id.toString()
    );

    if (!!reunionesActivas.length) {
      reunionesActivas.forEach((r) => {
        // convertimos a milisegundos de horaInicio y horaFinal de CADA elemento de reunionesActivas
        const rHoraInicio = new Date(r.horaInicio).getTime(); // le asignamos 10 minutos de ventaja
        const rHoraFinal = new Date(r.horaFinal).getTime();

        // vamos a verificar que "reunionHoraInicio" no sea igual o este entre los rangos
        // de fecha de CADA elemento de reunionesActivas
        if (
          (reunionHoraInicio >= rHoraInicio &&
            reunionHoraInicio <= rHoraFinal) ||
          (reunionHoraFinal >= rHoraInicio && reunionHoraFinal <= rHoraFinal) ||
          (rHoraInicio >= reunionHoraInicio && rHoraInicio <= reunionHoraFinal)
        ) {
          // si la prioridad de la nueva reunion es ALTA podemos reprogramar una reunion;
          if (
            tipoPrioridad === 'ALTA' &&
            r.prioridad.tipoPrioridad !== 'ALTA'
          ) {
            fueReprogramada = true;
            reunionQueColisiona = r;
            return;
          }

          existeColision = true;
          reunionQueColisiona = r;
          return;
        }
      });
    }

    // existe una colision de fechas
    if (existeColision) {
      reunionQueColisiona = await Reunion.findById(reunionQueColisiona._id)
        .populate('tipoReunion')
        .populate('estado')
        .populate('prioridad');

      return res.status(400).json({
        status: 400,
        message: 'existe una reunion en ese rango de horario',
        reunionQueColisiona,
      });
    }

    // si las oficinas son distintas cambiar el lugar de reunionesActivas
    if (data.oficina.toString() !== reunion.oficina.toString()) {
      oficina.reunionesActivas.push(reunion._id);
      oficina.historialDeReuniones.push(reunion._id);

      // buscamos la oficina antigua y sacamos la reunion de reuniones activas y su historial
      const oficinaVieja = await Oficina.findById(reunion.oficina);
      oficinaVieja.reunionesActivas = oficinaVieja.reunionesActivas.filter(
        (r) => r._id.toString() !== reunion._id.toString()
      );
      oficinaVieja.historialDeReuniones =
        oficinaVieja.historialDeReuniones.filter(
          (r) => r._id.toString() !== reunion._id.toString()
        );

      await oficinaVieja.save();
      await oficina.save();
    }

    // si la reunion es de prioridad alta
    if (fueReprogramada) {
      const estadoSuspendida = await Estado.findOne({
        nombreEstado: { $regex: 'Suspendida', $options: 'i' },
      });

      reunionQueColisiona = await Reunion.findByIdAndUpdate(
        reunionQueColisiona._id,
        { estado: estadoSuspendida._id }
      );

      oficina.reunionesActivas.push(reunion._id);
      // eliminamos a la reunion para reprogramar de reunionesActivas
      oficina.reunionesActivas = oficina.reunionesActivas.filter(
        (r) => r._id.toString() !== reunionQueColisiona._id.toString()
      );
      oficina.historialDeReuniones.push(reunion._id);

      await oficina.save();

      await reunion.save();

      // ENVIAR MENSAJE DE REPROGRAMACION

      return res.status(200).json({
        status: 200,
        message:
          'reunion fue creada con exito. La siguiente reunion tendra que ser reprogramada',
        reunionReprogramada: reunionQueColisiona,
      });
    }

    // modificar la reunion y cambiar los estados
    const resulado = await Reunion.findByIdAndUpdate(id, data);

    res.status(201).json({
      status: 201,
      message: 'reunion modificada con exito',
      resulado,
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
    const estadoDeshabilitada = await Estado.findOne({
      nombreEstado: { $regex: 'Deshabilitada', $options: 'i' },
    });

    const reunion = await Reunion.findByIdAndUpdate(id, {
      estaDeshabilitada: true,
      estado: estadoDeshabilitada._id,
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
    const oficina = await Oficina.findById(reunion.oficina);
    oficina.reunionesActivas = oficina.reunionesActivas.filter(
      (r) => r._id != reunion._id
    );
    await oficina.save();

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
    const estadoEnProceso = await Estado.findOne({
      nombreEstado: { $regex: 'En Proceso', $options: 'i' },
    });

    const reunion = await Reunion.findByIdAndUpdate(id, {
      reunionConfirmada: true,
      estado: estadoEnProceso._id,
    })
      .populate('tipoReunion')
      .populate('oficina')
      .populate('prioridad');
    if (!reunion) {
      return res.status(404).json({
        status: 404,
        message: 'reunion no encontrada',
      });
    }

    if (reunion.reunionConfirmada) {
      return res.status(400).json({
        status: 400,
        message: 'reunion esta confirmada',
      });
    }

    // validar que existan empleados
    const empleados = await Empleado.find({
      _id: { $in: reunion.participantes },
    });

    // creamos un arreglo de notificaciones: { empleado: empleadoId, reunion: reunionId }
    let notificaciones = empleados.map((empleado) => ({
      empleado: empleado._id,
      reunion: reunion._id,
    }));
    //guardamos los emails de los empleados en un array para luego mandar
    //los correos
    let emails = [];
    empleados.forEach((empleado) => {
      emails.push(empleado.email);
    });

    // guardamos en una sola instancia el arreglo de notificaciones
    await Notificacion.create(notificaciones);

    //acá va mandar el correo
    emailer.sendEmail(emails, reunion);

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
