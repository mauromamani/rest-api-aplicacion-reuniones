const { Schema, model } = require('mongoose');

const EmpleadoSchema = Schema({
  apellido: {
    type: String,
    required: true,
  },
  nombre: {
    type: String,
    required: true,
  },
  legajo: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  clave: {
    type: String,
    required: true,
  },
  rol: {
    type: String,
    required: true,
    enum: ['ADMINISTRADOR', 'PARTICIPANTE'],
  },
  dependencias: [
    {
      type: Schema.Types.ObjectId,
      required: true,
      ref: 'Dependencia',
    },
  ],
});

module.exports = model('Empleado', EmpleadoSchema);
