import { drizzle } from "drizzle-orm/d1";
import * as schema from "./schema";

export type Client = ReturnType<typeof init_database>["client"];
export type Schema = typeof schema;
export type Database = ReturnType<typeof init_database>;

export function init_database(d1: D1Database) {
  return { client: drizzle(d1, { schema, casing: "snake_case" }), schema };
}
