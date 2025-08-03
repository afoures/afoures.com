import { createRequestHandler } from "react-router";
import { init_database } from "./database";
import * as context from "./context";

const requestHandler = createRequestHandler(
  () => import("virtual:react-router/server-build"),
  import.meta.env.MODE
);

export default {
  async fetch(request, env, ctx) {
    return requestHandler(
      request,
      new Map([[context.db, init_database(env.DB)]])
    );
  },
} satisfies ExportedHandler<Env>;
