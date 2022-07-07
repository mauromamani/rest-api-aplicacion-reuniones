const { response } = require('express');
const Oficina = require('../models/Oficina');
const Reunion = require('../models/Reunion');


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
 * @method GET
 * @name obtenerEstadisticasOficinas
 */
const obtenerEstadisticasOficinas = async (req, res = response) => {
  try {
    const oficinas = (
      await Oficina.find().populate('reunion').populate('historialDeReuniones')
    ).map((x) => ({
      nombre: x['nombre'],
      historialDeReuniones: x['historialDeReuniones'].reduce(
        (r, { horaInicio }) => {
          let key = horaInicio.toISOString().slice(0, 7);
          r[key] = (r[key] || 0) + 1;
          return r;
        },
        {}
      ),
    }));

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
    const oficina = await Oficina.findByIdAndDelete(id);
    if (!oficina) {
      res.status(404).json({
        status: 404,
        message: 'oficina no encontrada',
      });
      return;
    }

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

/**
 * @method GET
 * @name obtenerOficinasLibres
 * @query { horaInicio:Date,
 *  horaFinal:Date}
 */
const obtenerOficinasLibres = async (req, res = response) => {
  let oficinasOcupadas = [];
  let {
    horaInicio,
    horaFinal,
  } = req.query;
  let query = {};
  // if (horaInicio && horaFinal) {
  //   query.horaInicio = { $gte: horaInicio };
  //   query.horaFinal = { $lt: horaFinal };
  // } else {
  //   return res.status(500).json({
  //     status: 500,
  //     message: 'no se envió fecha de Inicio o Fecha Final',
  //   });
  // }
  // verificar que la hora de inicio no sea mayor a hora de final
  if (horaInicio > horaFinal) {
    return res.status(500).json({
      status: 500,
      message: 'la hora de inicio no puede ser mayor a la hora de final',
    });
    return;
  }
  try {
    let reuniones = await Reunion.find()
      .populate('oficina');
    let reunionesHorario = []
    reuniones.forEach(r => {
      //se parsean las horas en milisegundos para compararlas
      if (Date.parse(r.horaInicio) >= Date.parse(horaInicio) && Date.parse(r.horaFinal) <= Date.parse(horaFinal)) {
        //reuniones con ese rango de fecha y hora
        reunionesHorario.push(r)
      }
    })
    let oficinasLibres = await Oficina.find();
    reunionesHorario.forEach(r => {
      //recorriendo las reuniones extraemos las oficinas que están siendo ocupadas en ese tiempo
      oficinasOcupadas.push(r.oficina);
    })
    oficinasOcupadas.forEach(e => {
      for (let index in oficinasLibres) {
        // console.log(recursosLibres[index]._id.toString())
        // console.log(e._id.toString());
        //se parsea a string los ids de los recursos para comparar
        if (oficinasLibres[index]._id.toString() == e._id.toString()) {
          //a todos los recursos le sacamos los recursos ocupados y nos quedan los recursos libres
          oficinasLibres.splice(index, 1);
        }
      }
    })

    res.status(200).json({
      status: 200,
      data: { oficinasLibres },

    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      status: 500,
      message: 'internal server error',
    });
  }

}


module.exports = {
  crearOficina,
  modificarOficina,
  obtenerOficinas,
  obtenerEstadisticasOficinas,
  eliminarOficina,
  obtenerOficinasLibres,
};
