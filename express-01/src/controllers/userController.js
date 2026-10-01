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
  const newUser = await userService.createUser({
    username: req.body.username,
    email: req.body.email,
  });

  // 201 Created: Sempre que um novo usuário for registrado com sucesso
  return res.status(201).send(newUser);
};

const updateUser = async (req, res) => {
  const updatedUser = await userService.updateUser(req.params.userId, {
    username: req.body.username,
    email: req.body.email,
  });

  // Validação: se o ID não existir, não há o que atualizar
  if (!updatedUser) {
    return res.status(404).send({ message: "Usuário não encontrado." });
  }

  // 200 OK: Sucesso para atualizações onde você retorna o objeto modificado
  return res.status(200).send(updatedUser);
};

const deleteUser = async (req, res) => {
  await userService.deleteUser(req.params.userId);

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