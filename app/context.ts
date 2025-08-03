import { unstable_createContext } from "react-router";
import type { Client, Schema } from "./database";

export const db = unstable_createContext<{
  client: Client;
  schema: Schema;
}>();
