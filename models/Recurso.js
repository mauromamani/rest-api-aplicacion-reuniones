const { Schema, model } = require('mongoose');

const RecursoSchema = Schema({
  nombre: {
    type: String,
    required: true,
  },
});

module.exports = model('Recurso', RecursoSchema);
