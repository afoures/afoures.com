import type { Config } from "drizzle-kit";

export default {
  out: "./migrations",
  schema: "./app/models/index.ts",
  dialect: "sqlite",
} satisfies Config;
