const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

const { connectMongo } = require('./config/mongo');

dotenv.config();

const app = express();

connectMongo();

app.use(express.json({ limit: '5mb' }));
app.use(cors());

// routes
app.use('/api/v1/autenticacion', require('./routes/autenticacion'));
app.use('/api/v1/empleados', require('./routes/empleados'));
app.use('/api/v1/reuniones', require('./routes/reuniones'));
app.use('/api/v1/dependencias', require('./routes/dependencia'));
app.use('/api/v1/estados', require('./routes/estado'));
app.use('/api/v1/oficinas', require('./routes/oficina'));
app.use('/api/v1/notificaciones', require('./routes/notificacion'));
app.use('/api/v1/tipo-reunion', require('./routes/tipoReunion'));
app.use('/api/v1/recursos', require('./routes/recursos'));
app.use('/api/v1/recursos-digitales', require('./routes/recursosDigitales'));
app.use('/api/v1/prioridades', require('./routes/prioridad'));

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port: ${PORT}`);
});
