const { Schema, model } = require('mongoose');
const OficinaSchema = Schema({
  nombre: {
    type: String,
    required: true,
  },
  estaOcupada: {
    type: Boolean,
    required: true,
  },
  reunion: {
    type: Schema.Types.ObjectId,
    required: false,
    ref: 'Reunion',
  },
})
module.exports = model('Oficina', OficinaSchema);