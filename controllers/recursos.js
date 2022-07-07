const { response } = require('express');
const Recurso = require('../models/Recurso');
const Reunion = require('../models/Reunion');
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
 */
const obtenerRecursos = async (req, res = response) => {
  try {
    const recursos = await Recurso.find();

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
 * @body { nombre: string }
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
    const recurso = await Recurso.findByIdAndDelete(id);
    if (!recurso) {
      res.status(404).json({
        status: 404,
        message: 'recurso no encontrado',
      });
      return;
    }

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

/**
 * @method GET
 * @name obtenerRecursosLibres
 * @query { horaInicio:Date,
 *  horaFinal:Date}
 */
const obtenerRecursosLibres = async (req, res = response) => {
  let recursosOcupados = [];
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
      .populate('recursos');
    let reunionesHorario = []
    reuniones.forEach(r => {
      //se parsean las horas en milisegundos para compararlas
      if (Date.parse(r.horaInicio) >= Date.parse(horaInicio) && Date.parse(r.horaFinal) <= Date.parse(horaFinal)) {
        //reuniones con ese rango de fecha y hora
        reunionesHorario.push(r)
      }
    })
    let recursosLibres = await Recurso.find();
    reunionesHorario.forEach(r => {
      r.recursos.forEach(e => {
        //recorriendo las reuniones extraemos los recursos que están siendo ocupados en ese tiempo
        recursosOcupados.push(e);
      })
    })
    recursosOcupados.forEach(e => {
      for (let index in recursosLibres) {
        // console.log(recursosLibres[index]._id.toString())
        // console.log(e._id.toString());
        //se parsea a string los ids de los recursos para comparar
        if (recursosLibres[index]._id.toString() == e._id.toString()) {
          //a todos los recursos le sacamos los recursos ocupados y nos quedan los recursos libres
          recursosLibres.splice(index, 1);
        }
      }
    })

    res.status(200).json({
      status: 200,
      data: { recursosLibres },

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
  crearRecurso,
  obtenerRecursos,
  modificarRecurso,
  eliminarRecurso,
  obtenerRecursosLibres,
};
