import { type } from "arktype";
import type { Database } from "~/database";
import { parse_published_content } from "~/models/content";

export async function get_note(
  { db }: { db: Database },
  { slug }: { slug: string }
) {
  const content = await db.client.query.content
    .findFirst({
      where: (content, { isNotNull, and, eq }) =>
        and(
          eq(content.slug, slug),
          eq(content.type, "note"),
          isNotNull(content.published_at)
        ),
      columns: {
        id: true,
        type: true,
        slug: true,
        published_at: true,
      },
      with: {
        metadata: {
          columns: {
            key: true,
            value: true,
          },
        },
      },
    })
    .execute();

  const parsed = parse_published_content([content]);

  if (parsed instanceof type.errors) {
    throw new Error(parsed.summary);
  }

  const note = parsed.at(0) ?? null;
  if (!note || note.type !== "note") {
    return null;
  }
  return note;
}
