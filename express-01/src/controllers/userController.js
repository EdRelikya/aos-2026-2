import { userService } from "../services/index.js";

const getUsers = async (req, res) => {
  const users = await userService.getAllUsers();
  // 200 OK: Sucesso padrão para listagem de dados
  return res.status(200).send(users);
};

const getUser = async (req, res) => {
  const user = await userService.getUserById(req.params.userId);
  
  // Validação: Se o ID não existir no banco, avisa o cliente
  if (!user) {
    return res.status(404).send({ message: "Usuário não encontrado." }); // 404 Not Found
  }

  // 200 OK: Sucesso ao buscar um usuário específico
  return res.status(200).send(user);
};

const createUser = async (req, res) => {
  // Exemplo de quando você implementar: const newUser = await userService.createUser(req.body);
  
  // 201 Created: Sempre que um novo usuário for registrado com sucesso
  return res.status(201).send("POST HTTP method on user resource");
};

const updateUser = async (req, res) => {
  // Exemplo de quando você implementar: const updatedUser = await userService.updateUser(req.params.userId, req.body);

  // 200 OK: Sucesso para atualizações onde você retorna o objeto modificado
  return res.status(200).send(`PUT HTTP method on user/${req.params.userId} resource`);
};

const deleteUser = async (req, res) => {
  // Exemplo de quando você implementar: await userService.deleteUser(req.params.userId);

  // 204 No Content: O usuário foi deletado e não há mais nada para exibir no corpo
  // Importante: Ao usar 204, use apenas .send() vazio, pois o HTTP proíbe corpo de resposta no 204
  return res.status(204).send();
};

export default {
  getUsers,
  getUser,
  createUser,
  updateUser,
  deleteUser,
};
