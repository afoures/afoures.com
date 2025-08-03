import { text, integer } from "drizzle-orm/sqlite-core";

export function created_at(name = "created_at") {
  return integer(name, { mode: "timestamp_ms" })
    .notNull()
    .$defaultFn(() => new Date());
}

export function updated_at(name = "updated_at") {
  return integer(name, { mode: "timestamp_ms" })
    .notNull()
    .$defaultFn(() => new Date())
    .$onUpdateFn(() => new Date());
}

declare class Tagged<Tag extends string> {
  protected _nominal_: Tag;
}

type Nominal<Type, Name extends string> = Type & Tagged<Name>;

export const UUID_LENGTH = 36;

export type UUID = Nominal<string, "uuid">;

export function uuid(name = "id") {
  return text(name, { mode: "text", length: UUID_LENGTH })
    .$type<UUID>()
    .primaryKey()
    .unique()
    .notNull()
    .$defaultFn(() => crypto.randomUUID() as UUID);
}
