import knex, { Knex } from "knex";

export const dbConfig: Knex.Config = {
  client: "sqlite3",
  connection: {
    filename: "./database/database.sqlite",
  },
  migrations: {
    directory: "./database/migrations",
    extension: "ts",
  },
  useNullAsDefault: true,
};

export const database = knex(dbConfig);
