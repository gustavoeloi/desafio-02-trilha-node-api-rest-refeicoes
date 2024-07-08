import fastify, { FastifyReply, FastifyRequest } from "fastify";
import cookie from "@fastify/cookie";
import { userRoutes } from "./routes/users/user.routes";
import { userSchemas } from "./routes/users/user.schema";
import jwt, { FastifyJWT } from "@fastify/jwt";
import { mealsSchema } from "./routes/meals/meals.schema";
import { mealsRoutes } from "./routes/meals/meals.routes";

export const app = fastify();

app.register(jwt, {
  secret: "super-secret-code",
});

app.addHook("preHandler", (req, res, next) => {
  req.jwt = app.jwt;
  return next();
});

app.decorate(
  "authenticate",
  async (req: FastifyRequest, reply: FastifyReply) => {
    const token = req.cookies.access_token;

    if (!token) {
      return reply.status(401).send({ message: "Authentication required" });
    }

    const decoded = req.jwt.verify<FastifyJWT["user"]>(token);
    req.user = decoded;
  }
);

app.register(cookie, {
  secret: "some-secret-key",
  hook: "preHandler",
});

for (const schema of [...userSchemas]) {
  app.addSchema(schema);
}

for (const schema of [...mealsSchema]) {
  app.addSchema(schema);
}

app.register(userRoutes, {
  prefix: "/users",
});

app.register(mealsRoutes, {
  prefix: "/meals",
});
