import { z } from "zod";

const REQUIRED = "Campo obrigatório";

// String obrigatória: campo ausente vira "Campo obrigatório"
const requiredString = (label) =>
  z.string({
    error: (issue) =>
      issue.input === undefined ? REQUIRED : `${label} deve ser um texto`,
  });

const uuidV4 = () =>
  z.uuid({
    version: "v4",
    error: "Identificador inválido: informe um UUID v4 válido",
  });

export const createUserSchema = z.object({
  body: z.object({
    username: requiredString("username")
      .trim()
      .min(1, { error: "Não pode ser vazio" }),
    email: z.email({
      error: (issue) =>
        issue.input === undefined ? REQUIRED : "Formato de e-mail inválido",
    }),
  }),
});

export const userIdParamSchema = z.object({
  params: z.object({
    userId: uuidV4(),
  }),
});

export const createMessageSchema = z.object({
  body: z.object({
    text: requiredString("text")
      .trim()
      .min(1, { error: "Não pode ser vazio" })
      .max(1000, { error: "Máximo de 1000 caracteres" }),
  }),
});

export const messageIdParamSchema = z.object({
  params: z.object({
    messageId: uuidV4(),
  }),
});