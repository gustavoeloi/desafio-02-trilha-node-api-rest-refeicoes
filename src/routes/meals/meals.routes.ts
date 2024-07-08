import { FastifyInstance } from "fastify";
import {
  createMeal,
  deleteMeal,
  editMeal,
  getAllMeals,
  getMeal,
  getMetrics,
} from "./meals.controller";
import { $ref } from "./meals.schema";

export async function mealsRoutes(app: FastifyInstance) {
  app.post(
    "/create",
    {
      preHandler: [app.authenticate],
      schema: {
        body: $ref("createMealSchema"),
      },
    },
    createMeal
  );

  app.get(
    "/",
    {
      preHandler: [app.authenticate],
    },
    getAllMeals
  );

  app.get(
    "/:id",
    {
      preHandler: [app.authenticate],
    },
    getMeal
  );

  app.put(
    "/:id",
    {
      preHandler: [app.authenticate],
      schema: {
        body: $ref("editMealSchema"),
      },
    },
    editMeal
  );

  app.delete(
    "/:id",
    {
      preHandler: [app.authenticate],
    },
    deleteMeal
  );

  app.get(
    "/metrics",
    {
      preHandler: [app.authenticate],
    },
    getMetrics
  );
}
