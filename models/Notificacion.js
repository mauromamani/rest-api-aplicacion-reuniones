const { Schema, model } = require('mongoose');
const NotificacionSchema = Schema({
  empleado: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'Empleado',
  },
  reunion: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'Reunion',
  }
})
module.exports = model('Notificacion', NotificacionSchema);