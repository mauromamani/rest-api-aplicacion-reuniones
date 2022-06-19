const { Schema, model } = require('mongoose');

const DependenciaSchema = Schema({
  tipo: {
    type: String,
    required: true,
  },
});

module.exports = model('Dependencia', DependenciaSchema);
