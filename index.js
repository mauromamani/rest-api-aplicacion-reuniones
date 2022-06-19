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
app.use('/api/v1/empleados', require('./routes/empleados'));
app.use('/api/v1/recursos', require('./routes/recursos'));
app.use('/api/v1/recursos-digitales', require('./routes/recursosDigitales'));

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port: ${PORT}`);
});
