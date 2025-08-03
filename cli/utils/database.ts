import path from "node:path";
import type { DrizzleConfig } from "drizzle-orm";
import { drizzle as drizzle_libsql } from "drizzle-orm/libsql";
import { drizzle as drizzle_sqlite_proxy } from "drizzle-orm/sqlite-proxy";
import { createClient as create_libsql_client } from "@libsql/client";
import * as schema from "../../app/database/schema";
import { get_local_sqlite_db_path } from "../../app/database/utils";

export type Database = ReturnType<typeof local> | ReturnType<typeof remote>;

export { schema };

const DB_CONFIG = {
  casing: "snake_case",
  schema,
} as const satisfies DrizzleConfig<typeof schema>;

export function local({ root }: { root: string }) {
  const sqlite_file = path.resolve(
    root,
    get_local_sqlite_db_path("website-content")
  );
  const client = create_libsql_client({
    url: `file:${sqlite_file}`,
  });
  return drizzle_libsql(client, DB_CONFIG);
}

export function remote() {
  const api_token = process.env.CLOUDFLARE_D1_TOKEN;
  const account_id = process.env.CLOUDFLARE_ACCOUNT_ID;
  const database_id = process.env.CLOUDFLARE_DATABASE_ID;

  if (!api_token || !account_id || !database_id) {
    throw new Error("Production environment variables unset.");
  }

  async function query_d1_database_via_http(
    sql: string,
    params: unknown[],
    method: string
  ) {
    const url = `https://api.cloudflare.com/client/v4/accounts/${account_id}/d1/database/${database_id}/query`;

    const response = await fetch(url, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${api_token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ sql, params, method }),
    });

    if (response.status !== 200) {
      throw new Error(
        `Query Request Failed: ${response.status} ${response.statusText}`,
        { cause: response }
      );
    }

    const payload: {
      errors?: { code: number; message: string }[];
      messages?: { code: number; message: string }[];
      result?: { results: unknown[]; success: boolean }[];
      success?: boolean;
    } = (await response.json()) as any;

    if (payload.errors?.length || !payload.success) {
      throw new Error(`Query Failed: \n${JSON.stringify(payload)}}`, {
        cause: payload,
      });
    }

    const result = payload?.result?.at(0);
    if (!result?.success) {
      throw new Error(`Query Failed: \n${JSON.stringify(payload)}`, {
        cause: result,
      });
    }

    const rows = result.results.map((row) => {
      if (row instanceof Object) return Object.values(row);

      throw new TypeError("Unexpected Response: Malformed rows", {
        cause: payload,
      });
    });

    return { rows };
  }

  async function batch_query_d1_database_via_http(
    queries: Array<{ sql: string; params: unknown[]; method: string }>
  ) {
    const results: { rows: unknown[][] }[] = [];

    for (const query of queries) {
      const { sql, params, method } = query;
      const result = await query_d1_database_via_http(sql, params, method);
      results.push(result);
    }

    return results;
  }

  return drizzle_sqlite_proxy(
    query_d1_database_via_http,
    batch_query_d1_database_via_http,
    DB_CONFIG
  );
}
