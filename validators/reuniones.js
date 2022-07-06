// Verificar que la hora de inicio no sea mayor a hora de final
const verificarHoraFinal = (reunionHoraInicio, reunionHoraFinal, res) => {
  if (reunionHoraInicio > reunionHoraFinal) {
    return res.status(400).json({
      status: 400,
      message:
        'la fecha final de la reunion no debe ser menor a la fecha de inico',
    });
  }
};

// Verificar que la reunion no sea a la misma hora
const verificarHorasIguales = (reunionHoraInicio, reunionHoraFinal, res) => {
  if (reunionHoraInicio === reunionHoraFinal) {
    return res.status(400).json({
      status: 400,
      message: 'las reuniones no pueden comenzar y terminar al mismo tiempo',
    });
  }
};

// Verificar que la reunion no sea de menos de 30 minutos
const verificarReunionCorta = (reunionHoraInicio, reunionHoraFinal, res) => {
  if (reunionHoraFinal - reunionHoraInicio < 1800000) {
    return res.status(400).json({
      status: 400,
      message: 'las reuniones deben durar al menos 30 minutos',
    });
  }
};

module.exports = {
  verificarHoraFinal,
  verificarHorasIguales,
  verificarReunionCorta,
};
