const errorMiddleware = (err, req, res, next) => {
  // Erros de validação do Sequelize (ex.: campo obrigatório vazio)
  if (err.name === "SequelizeValidationError") {
    return res.status(400).send({
      status: "fail",
      message: err.errors.map((e) => e.message).join(", "),
      ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
    });
  }

  // Violação de valor único (ex.: username ou email duplicado)
  if (err.name === "SequelizeUniqueConstraintError") {
    return res.status(409).send({
      status: "fail",
      message: `Já existe um registro com esse valor: ${err.errors
        .map((e) => e.path)
        .join(", ")}`,
      ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
    });
  }

  // Erros previstos de negócio (lançados com "throw new AppError(...)")
  if (err.isOperational) {
    return res.status(err.statusCode).send({
      status: err.status,
      message: err.message,
      ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
    });
  }

  // Erro inesperado: nunca vaza detalhes internos para o cliente
  console.error("ERRO INESPERADO:", err);
  return res.status(500).send({
    status: "error",
    message: "Algo deu errado no servidor",
    ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
  });
};

export default errorMiddleware;