const { Schema, model } = require('mongoose');

const OficinaSchema = Schema({
  nombre: {
    type: String,
    required: true,
  },
  reunionesActivas: [
    {
      type: Schema.Types.ObjectId,
      required: false,
      ref: 'Reunion',
    },
  ],
  historialDeReuniones: [
    {
      type: Schema.Types.ObjectId,
      required: false,
      ref: 'Reunion',
    },
  ],
});

module.exports = model('Oficina', OficinaSchema);
