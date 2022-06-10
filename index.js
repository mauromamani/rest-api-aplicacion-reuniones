const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

const { connectMongo } = require('./config/mongo');

dotenv.config();

const app = express();

connectMongo();

app.use(express.json());
app.use(cors());

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port: ${PORT}`);
});
