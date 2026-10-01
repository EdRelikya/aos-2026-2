import { userService } from "../services/index.js";

const getSession = async (req, res) => {
  const user = await userService.getUserById(req.context.me.id);

  // Validação de segurança: se o token/contexto existia mas o usuário sumiu do banco
  if (!user) {
    return res.status(401).send({ message: "Sessão inválida ou não autorizada." }); // 401 Unauthorized
  }

  // 200 OK: Sucesso ao retornar os dados da sessão atual
  return res.status(200).send(user);
};

export default {
  getSession,
};
