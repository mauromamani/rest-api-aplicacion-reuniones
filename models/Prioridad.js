const { Schema, model } = require('mongoose');

const PrioridadSchema = Schema({
  tipoPrioridad: {
    type: String,
    required: true,
  },
});

module.exports = model('Prioridad', PrioridadSchema);
