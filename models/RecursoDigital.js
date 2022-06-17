const { Schema, model } = require('mongoose');

const RecursoDigitalSchema = Schema({
  nombre: {
    type: String,
    required: true,
  },
  recurso: {
    type: String,
    required: true,
  },
});

module.exports = model('RecursoDigital', RecursoDigitalSchema);
