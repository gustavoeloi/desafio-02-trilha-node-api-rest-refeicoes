import { FastifyReply, FastifyRequest } from "fastify";
import { CreateUserInput, LoginUserInput } from "./user.schema";
import bcrypt from "bcrypt";
import { database } from "../../database";
import { randomUUID } from "crypto";

const SALT_ROUNDS = 10;

export async function createUser(
  req: FastifyRequest<{ Body: CreateUserInput }>,
  reply: FastifyReply
) {
  const { name, email, password } = req.body;

  const user = await database("users").where("email", email).first();

  if (user) {
    return reply.code(401).send({
      message: "User already exists with this email",
    });
  }

  try {
    const hash = await bcrypt.hash(password, SALT_ROUNDS);
    const user = await database("users").insert({
      id: randomUUID(),
      name,
      email,
      password: hash,
    });

    return reply.code(201).send(user);
  } catch (e) {
    return reply.code(500).send(e);
  }
}

export async function login(
  req: FastifyRequest<{ Body: LoginUserInput }>,
  reply: FastifyReply
) {
  const { email, password } = req.body;

  const user = await database("users").where("email", email).first();

  const isMatch = user && (await bcrypt.compare(password, user.password));

  if (!user || !isMatch) {
    return reply.code(401).send({
      message: "Invalid email or password",
    });
  }

  const payload = {
    id: user.id,
    email: user.email,
    name: user.name,
  };

  const token = req.jwt.sign(payload);

  reply.setCookie("access_token", token, {
    path: "/",
    httpOnly: true,
    secure: true,
  });

  return { acessToken: token };
}

export async function getUsers(req: FastifyRequest, reply: FastifyReply) {
  const users = await database("users").select("*");

  return reply.code(200).send(users);
}
