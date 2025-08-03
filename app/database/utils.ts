import crypto from "node:crypto";

function durable_object_namespace_id_from_name(
  unique_key: string,
  name: string
) {
  const key = crypto.createHash("sha256").update(unique_key).digest();
  const name_hmac = crypto
    .createHmac("sha256", key)
    .update(name)
    .digest()
    .subarray(0, 16);
  const hmac = crypto
    .createHmac("sha256", key)
    .update(name_hmac)
    .digest()
    .subarray(0, 16);
  return Buffer.concat([name_hmac, hmac]).toString("hex");
}

export function get_local_sqlite_db_path(name: string) {
  const key = "miniflare-D1DatabaseObject";
  const namespace = durable_object_namespace_id_from_name(key, name);
  return `.wrangler/state/v3/d1/${key}/${namespace}.sqlite`;
}
