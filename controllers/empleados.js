const { response } = require('express');
const Empleado = require('../models/Empleado');
const Dependencia = require('../models/Dependencia');

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
    if (dependencias.includes(null) || !dependencias.length) {
      res.status(404).json({
        status: 404,
        message: 'dependencia no encontrada',
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
    const empleados = await Empleado.find();

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
    const dependencias = await Dependencia.find({
      _id: { $in: data.dependencias },
    });
    if (dependencias.includes(null) || !dependencias.length) {
      res.status(404).json({
        status: 404,
        message: 'dependencia no encontrada',
      });
      return;
    }

    // Verificar que el empleado no este registrado
    empleado = await Empleado.findOne({ email: data.email });
    if (empleado) {
      res.status(400).json({
        status: 400,
        message: 'el empleado ya esta registrado',
      });
      return;
    }

    let empleado = await Empleado.findByIdAndUpdate(id, data);
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
    console.log(error);
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

module.exports = {
  crearEmpleado,
  obtenerEmpleados,
  modificarEmpleado,
  eliminarEmpleado,
};