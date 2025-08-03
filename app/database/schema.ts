import { relations } from "drizzle-orm";
import { sqliteTable, text, integer, unique } from "drizzle-orm/sqlite-core";
import { created_at, updated_at, uuid, UUID_LENGTH } from "./columns";

export const content = sqliteTable(
  "content",
  {
    id: uuid("id"),
    // timestamps
    created_at: created_at("created_at"),
    updated_at: updated_at("updated_at"),
    // attributes
    type: text("type", {
      enum: ["article", "note"],
      length: 255,
    }).notNull(),
    slug: text("slug", { mode: "text", length: 255 }).notNull(),
    published_at: integer("published_at", { mode: "timestamp_ms" }),
    // relations
  } as const,
  (t) => [unique("content_reference").on(t.type, t.slug)]
);

export const content_metadata = sqliteTable("content_metadata", {
  id: uuid("id"),
  // timestamps
  created_at: created_at("created_at"),
  updated_at: updated_at("updated_at"),
  // attributes
  key: text("key", { mode: "text", length: 255 }).notNull(),
  value: text("value", { mode: "text" }).notNull(),
  // relations
  related_content_id: text("related_content_id", {
    mode: "text",
    length: UUID_LENGTH,
  })
    .notNull()
    .references(() => content.id, { onDelete: "cascade" }),
});

export const content_relations = relations(content, ({ many }) => {
  return {
    metadata: many(content_metadata),
  };
});

export const content_metadata_relations = relations(
  content_metadata,
  ({ one }) => {
    return {
      content: one(content, {
        fields: [content_metadata.related_content_id],
        references: [content.id],
      }),
    };
  }
);
