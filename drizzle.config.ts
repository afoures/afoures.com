import type { Config } from "drizzle-kit";
import { get_local_sqlite_db_path } from "./app/database/utils";

export default {
  out: "./migrations",
  schema: "./app/database/schema.ts",
  dialect: "sqlite",
  dbCredentials: {
    url: get_local_sqlite_db_path("website-content"),
  },
} satisfies Config;
