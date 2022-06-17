const { Schema, model } = require('mongoose');

const RecursoSchema = Schema({
  nombre: {
    type: String,
    required: true,
  },
  estaReservado: {
    type: Boolean,
    default: false,
  },
});

module.exports = model('Recurso', RecursoSchema);
