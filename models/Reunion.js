const { Schema, model } = require('mongoose');

const ReunionSchema = Schema({
  horaInicio: {
    type: Date,
    required: true,
  },
  horaFinal: {
    type: Date,
    required: true,
  },
  participantes: [
    {
      type: Schema.Types.ObjectId,
      required: false,
      ref: 'Empleado',
    },
  ],
  recursos: [
    {
      type: Schema.Types.ObjectId,
      required: false,
      ref: 'Recurso',
    },
  ],
  recursosDigitales: [
    {
      type: Schema.Types.ObjectId,
      required: false,
      ref: 'RecursoDigital',
    },
  ],
  prioridad: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'Prioridad',
  },
  tipoReunion: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'TipoReunion',
  },
});

module.exports = model('Reunion', ReunionSchema);
