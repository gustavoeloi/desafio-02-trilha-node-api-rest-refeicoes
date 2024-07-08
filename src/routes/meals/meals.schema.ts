import { buildJsonSchemas } from "fastify-zod";
import { z } from "zod";

const createMealSchema = z.object({
  name: z.string(),
  description: z.string().max(200).optional(),
  dateAndTime: z.string(),
  isOnDiet: z.enum(["yes", "no"], {
    invalid_type_error: "This input accept only two values: yes or no",
    required_error: "Please, advise if you meal is on your diet",
  }),
});

export type CreateMealInput = z.infer<typeof createMealSchema>;

const createMealResponseSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string(),
  dateAndTime: z.string(),
});

const editMealSchema = z.object({
  name: z.string().optional(),
  description: z.string().optional(),
  dateAndTime: z.string().optional(),
  isOnDiet: z.enum(["yes", "no"]).optional(),
});

export type editMealInputSchema = z.infer<typeof editMealSchema>;

export const { schemas: mealsSchema, $ref } = buildJsonSchemas(
  {
    createMealSchema,
    createMealResponseSchema,
    editMealSchema,
  },
  { $id: "MealSchemas" }
);
