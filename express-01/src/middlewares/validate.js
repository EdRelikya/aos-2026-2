// Recebe um schema do Zod e devolve um middleware que valida body, params e query.
// Se algo for inválido, o parseAsync lança um ZodError. No Express 5 a rejeição
// é encaminhada sozinha ao middleware global de erro (sem try/catch).
const validate = (schema) => async (req, res, next) => {
  const data = await schema.parseAsync({
    body: req.body ?? {},
    params: req.params,
    query: req.query,
  });

  // Substitui pelos dados já validados e limpos (campos extras são removidos)
  if (data.body !== undefined) {
    req.body = data.body;
  }
  if (data.params !== undefined) {
    req.params = data.params;
  }
  if (data.query !== undefined) {
    // No Express 5, req.query só tem leitura: não dá para atribuir direto
    Object.defineProperty(req, "query", {
      value: data.query,
      writable: true,
      configurable: true,
      enumerable: true,
    });
  }

  next();
};

export default validate;