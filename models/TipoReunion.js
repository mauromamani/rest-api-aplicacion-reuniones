const { Schema, model } = require('mongoose');
const TipoReunionSchema = Schema({
  tipoReunion: {
    type: String,
    require: true,
  },
})
module.exports = model('TipoReunion', TipoReunionSchema);