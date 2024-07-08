import { FastifyReply, FastifyRequest } from "fastify";
import { CreateMealInput, editMealInputSchema } from "./meals.schema";

import { randomUUID } from "node:crypto";
import { database } from "../../database";

export async function createMeal(
  req: FastifyRequest<{ Body: CreateMealInput }>,
  reply: FastifyReply
) {
  const { name, description, dateAndTime, isOnDiet } = req.body;

  const { id: userId } = req.user;

  try {
    const meal = await database("meals")
      .insert({
        id: randomUUID(),
        name,
        description,
        date_and_time: dateAndTime,
        on_diet: isOnDiet,
        user_id: userId,
      })
      .returning("*");

    reply.status(201).send(meal);
  } catch (e) {
    reply.status(500).send(e);
  }
}

export async function getAllMeals(req: FastifyRequest, reply: FastifyReply) {
  const { id: userId } = req.user;

  const meals = await database("meals").where("user_id", userId);

  if (!meals) {
    return reply.code(404).send("You don't have any meals on our records.");
  }

  return reply.code(200).send(meals);
}

export async function editMeal(
  req: FastifyRequest<{ Body: editMealInputSchema; Params: { id: string } }>,
  reply: FastifyReply
) {
  const { id } = req.params;
  const { id: userId } = req.user;
  const { name, description, dateAndTime, isOnDiet } = req.body;

  const meal = await database("meals")
    .where({
      id,
      user_id: userId,
    })
    .first();

  if (!meal) {
    return reply.code(404).send({ message: "Not Found!" });
  }

  try {
    await database("meals")
      .where({
        id,
        user_id: userId,
      })
      .update({
        name: name ?? meal.name,
        description: description ?? meal.description,
        date_and_time: dateAndTime ?? meal.date_and_time,
        on_diet: isOnDiet ?? meal.on_diet,
      });

    return reply.status(200).send({ message: "Meal updated with sucessful" });
  } catch (e) {
    return reply.status(500).send(e);
  }
}

export async function deleteMeal(
  req: FastifyRequest<{ Params: { id: string } }>,
  reply: FastifyReply
) {
  const { id } = req.params;

  const meal = await database("meals").where("id", id).first();

  if (!meal) {
    return reply.status(404).send({ message: "Not Found!" });
  }

  try {
    await database("meals").where("id", id).del();

    return reply.status(200).send({ message: "Meal deleted with successful" });
  } catch (e) {
    return reply.status(500).send(e);
  }
}

export async function getMeal(
  req: FastifyRequest<{ Params: { id: string } }>,
  reply: FastifyReply
) {
  const { id } = req.params;

  const meal = await database("meals").where("id", id).first();

  if (!meal) {
    return reply.code(404).send({ message: "Not Found" });
  }

  return reply.status(200).send(meal);
}

export async function getMetrics(
  req: FastifyRequest<{ Params: { id: string } }>,
  reply: FastifyReply
) {
  const { id: userId } = req.user;

  const meals = await database("meals").where("user_id", userId);

  if (!meals) {
    return reply
      .status(404)
      .send({ message: "You don't have a meal on our records!" });
  }

  let inDietQtd = 0;
  let notInDietQtd = 0;

  meals.map((meal) => {
    if (meal.on_diet === "yes") {
      inDietQtd++;
    } else {
      notInDietQtd++;
    }

    return { inDietQtd, notInDietQtd };
  });

  return reply.status(200).send({
    totalMeals: meals.length,
    mealsInDiet: inDietQtd,
    mealsNotInDiet: notInDietQtd,
  });
}
