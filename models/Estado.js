const { Schema, model } = require('mongoose');
const EstadoSchema = Schema({
  nombreEstado: {
    type: String,
    required: true,
  },
})

module.exports = model('Estado', EstadoSchema);