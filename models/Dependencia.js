const { Schema, model } = require('mongoose');

const DependenciaSchema = Schema({
  dependencia: {
    type: String,
    required: true,
  },
});

module.exports = model('Dependencia', DependenciaSchema);
