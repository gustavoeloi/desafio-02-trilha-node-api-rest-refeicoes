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

  interface Tables {
    users: User;
  }
}
