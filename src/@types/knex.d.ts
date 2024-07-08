// eslint-disable-next-line
import { Knex } from "knex";

declare module "knex/types/tables" {
  interface User {
    id: string;
    name: string;
    email: string;
    password: string;
    created_at: string;
  }

  interface Meal {
    id: string;
    name: string;
    description: string;
    date_and_time: string;
    on_diet: "yes" | "no";
    user_id: string;
    created_at: string;
  }

  interface Tables {
    users: User;
    meals: Meal;
  }
}
