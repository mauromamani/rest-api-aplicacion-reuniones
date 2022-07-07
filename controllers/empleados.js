const { response } = require('express');
const Empleado = require('../models/Empleado');
const Dependencia = require('../models/Dependencia');
const Reunion = require('../models/Reunion');

/**
 * @method POST
 * @name crearEmpleado
 * @body { 
    apellido: string,
    nombre: string,
    legajo: string,
    email: string,
    clave: string,
    rol: ("PARTICIPANTE", "ADMINISTRADOR"),
    dependencias: Dependencia[]
   }
 */
const crearEmpleado = async (req, res = response) => {
  const data = req.body;

  try {
    // Verificar que las dependencias existen o que no este vacio
    const dependencias = await Dependencia.find({
      _id: { $in: data.dependencias },
    });
    if (!dependencias.length) {
      res.status(404).json({
        status: 404,
        message: 'dependencias no pueden estar vacias ',
      });
      return;
    }

    // Verificar que el empleado no este registrado
    const empleado = await Empleado.findOne({ email: data.email });
    if (empleado) {
      res.status(400).json({
        status: 400,
        message: 'el empleado ya esta registrado',
      });
      return;
    }

    data.dependencias = dependencias;
    const nuevoEmpleado = new Empleado(data);
    await nuevoEmpleado.save();

    res.status(201).json({
      status: 201,
      message: 'empleado creado con exito',
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
 * @name obtenerEmpleados
 */
const obtenerEmpleados = async (req, res = response) => {
  try {
    const empleados = await Empleado.find().populate('dependencias');

    res.status(200).json({
      status: 200,
      data: { empleados },
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
 * @name obtenerEmpleadoPorId
 * @params { id: string }
 */
const obtenerEmpleadoPorId = async (req, res = response) => {
  const { id } = req.params;

  try {
    const empleado = await Empleado.findById(id).populate('dependencias');
    if (!empleado) {
      res.status(404).json({
        status: 404,
        message: 'empleado no encontrado',
      });
      return;
    }

    res.status(200).json({
      status: 200,
      data: { empleado },
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
 * @name modificarEmpleado
 * @body { 
    apellido: string,
    nombre: string,
    legajo: string,
    email: string,
    clave: string,
    rol: ("PARTICIPANTE", "ADMINISTRADOR"),
    dependencias: Dependencia[]
   }
 * @params { id: string }
 */
const modificarEmpleado = async (req, res = response) => {
  const { id } = req.params;
  const { _id, ...data } = req.body;

  try {
    // Verificar que las dependencias existen o que no este vacio
    let dependencias;
    if (data.dependencias) {
      dependencias = await Dependencia.find({
        _id: { $in: data.dependencias },
      });

      if (!dependencias.length) {
        res.status(404).json({
          status: 404,
          message: 'dependencia no encontrada',
        });
        return;
      }
    }

    data.dependencias = dependencias;
    const empleado = await Empleado.findByIdAndUpdate(id, data);
    if (!empleado) {
      res.status(404).json({
        status: 404,
        message: 'empleado no encontrado',
      });
      return;
    }

    res.status(200).json({
      status: 200,
      message: 'empleado modificado con exito',
    });
  } catch (error) {
    if (error.message.includes('duplicate key')) {
      res.status(400).json({
        status: 400,
        message: 'un empleado con ese email ya está registrado',
      });
      return;
    }

    res.status(500).json({
      status: 500,
      message: 'internal server error',
    });
  }
};

/**
 * @method DELETE
 * @name eliminarEmpleado
 * @params { id: string }
 */
const eliminarEmpleado = async (req, res = response) => {
  const { id } = req.params;

  try {
    const empleado = await Empleado.findByIdAndDelete(id);
    if (!empleado) {
      res.status(404).json({
        status: 404,
        message: 'empleado no encontrado',
      });
      return;
    }

    res.status(200).json({
      status: 200,
      message: 'empleado eliminado con exito',
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
 * @name obtenerEmpleadosLibres
 * @query { horaInicio:Date,
 *  horaFinal:Date}
 */
const obtenerEmpleadosLibres = async (req, res = response) => {
  let empleadosOcupados = [];
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
      .populate('participantes');
    let reunionesHorario = []
    reuniones.forEach(r => {
      console.log()
      if (Date.parse(r.horaInicio) >= Date.parse(horaInicio) && Date.parse(r.horaFinal) <= Date.parse(horaFinal)) {
        reunionesHorario.push(r)
      }
    })
    //console.log(reuniones[0])
    let empleadosLibres = await Empleado.find().populate('dependencias');
    reunionesHorario.forEach(r => {
      r.participantes.forEach(e => {
        empleadosOcupados.push(e);
      })
    })
    empleadosOcupados.forEach(e => {
      for (let index in empleadosLibres) {
        if (empleadosLibres[index].email == e.email) {
          empleadosLibres.splice(index, 1);
        }
      }
    })

    res.status(200).json({
      status: 200,
      data: { empleadosLibres },

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
  crearEmpleado,
  obtenerEmpleados,
  obtenerEmpleadoPorId,
  modificarEmpleado,
  eliminarEmpleado,
  obtenerEmpleadosLibres,
};
