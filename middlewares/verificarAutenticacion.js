const jwt = require('jsonwebtoken');

const verificarAutenticacion = (req, res, next) => {
  const token = req.header('x-token');

  if (!token) {
    return res.status(401).json({
      status: 401,
      message: 'token no encontrado',
    });
  }

  try {
    const { uid } = jwt.verify(token, process.env.SECRET_JWT_SEED);

    req.uid = uid;

    next();
  } catch (error) {
    return res.status(401).json({
      status: 401,
      message: 'token no valido',
    });
  }
};

module.exports = { verificarAutenticacion };
