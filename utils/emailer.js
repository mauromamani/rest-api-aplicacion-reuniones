const nodemailer = require('nodemailer');
const nodeMailerSendgrid = require('nodemailer-sendgrid');
const createTrans = () => {
  const transport = nodemailer.createTransport(
    nodeMailerSendgrid({
      apiKey:
        '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',
    })
  );
  return transport;
};

const sendEmail = async (emails, reunion) => {
  const transporter = createTrans();
  const options = {
    weekday: 'long',
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    timeZone: 'America/Argentina/Jujuy',
    hour12: true,
    hour: 'numeric',
    minute: '2-digit',
  };
  //formateo de fechas
  const horaInicio = new Date(reunion.horaInicio).toLocaleString(
    'es-AR',
    options
  );
  const horaFinal = new Date(reunion.horaFinal).toLocaleString(
    'es-AR',
    options
  );

  const info = await transporter.sendMail({
    from: '"Grupo9" <eventos.grupo9@gmail.com>',
    to: emails,
    subject: 'Reunion Programada',
    html: `<h2>Hola, te notificamos que tu reunion fue confirmada!</h2>
    <p>Hora de Inicio: ${horaInicio}</p>
    <p>Hora de Finalizacion: ${horaFinal}</p>
    <p>Tipo de Reunion: ${reunion.tipoReunion.tipoReunion}</p>
    <p>Oficina: ${reunion.oficina.nombre}</p>
    <p>Prioridad: ${reunion.prioridad.tipoPrioridad}</p>
    `,
  });

  return;
};
const sendEmailReprogramed = async (emails, reunion) => {
  const transporter = createTrans();
  const options = {
    weekday: 'long',
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    timeZone: 'America/Argentina/Jujuy',
    hour12: true,
    hour: 'numeric',
    minute: '2-digit',
  };
  //formateo de fechas
  const horaInicio = new Date(reunion.horaInicio).toLocaleString(
    'es-AR',
    options
  );
  const horaFinal = new Date(reunion.horaFinal).toLocaleString(
    'es-AR',
    options
  );

  const info = await transporter.sendMail({
    from: '"Grupo9" <eventos.grupo9@gmail.com>',
    to: emails,
    subject: 'Reunion Reprogramada',
    html: `<h2>Hola, te notificamos que tu reunion va a ser reprogramada!</h2>
    <h3>Reunion:</h3>
    <p>Hora de Inicio: ${horaInicio}</p>
    <p>Hora de Finalizacion: ${horaFinal}</p>
    <p>Tipo de Reunion: ${reunion.tipoReunion.tipoReunion}</p>
    <p>Oficina: ${reunion.oficina.nombre}</p>
    <p>Prioridad: ${reunion.prioridad.tipoPrioridad}</p>
    <p></p>
    <h3>Te informaremos a la brevedad los nuevos horarios de tu reunion!</h3>
    `,
  });

  return;
};


exports.sendEmail = (emails, reunion) => sendEmail(emails, reunion);
exports.sendEmailReprogramed = (emails, reunion) => sendEmailReprogramed(emails, reunion);