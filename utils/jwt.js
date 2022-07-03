const jwt = require('jsonwebtoken');

const generarJWT = (uid) => {
  return new Promise((resolve, reject) => {
    const payload = { uid };

    jwt.sign(
      payload,
      process.env.SECRET_JWT_SEED || 'palabra-secreta',
      {
        expiresIn: '1h',
      },
      (err, token) => {
        if (err) {
          console.log(err);
          reject('No se pudo generar el token');
        }

        resolve(token);
      }
    );
  });
};

module.exports = { generarJWT };
