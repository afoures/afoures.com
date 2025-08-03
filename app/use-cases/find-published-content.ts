import { type } from "arktype";
import { startOfMonth, startOfYear } from "date-fns";
import type { Database } from "~/database";
import { parse_published_content } from "~/models/content";

type Entries = Array<{
  id: string;
  type: "article" | "note";
  title: string;
  published_at: Date;
  pathname: string;
}>;

type EntriesGroupedByMonth = Map<string, Entries>;

type EntriesGroupedByYear = Map<string, EntriesGroupedByMonth>;

export async function find_published_content({ db }: { db: Database }) {
  const content = await db.client.query.content
    .findMany({
      where: (content, { isNotNull }) => isNotNull(content.published_at),
      orderBy: (content, { desc }) => desc(content.published_at),
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

  const parsed = parse_published_content(content);

  if (parsed instanceof type.errors) {
    throw new Error(parsed.summary);
  }

  const timeline: EntriesGroupedByYear = new Map();
  for (const entry of parsed) {
    const year = startOfYear(entry.published_at).toISOString();
    const month = startOfMonth(entry.published_at).toISOString();
    const months: EntriesGroupedByMonth = timeline.get(year) ?? new Map();
    const entries: Entries = months.get(month) ?? [];

    entries.push({ ...entry, pathname: `/${entry.type}s/${entry.slug}` });
    months.set(month, entries);
    timeline.set(year, months);
  }

  return Array.from(timeline.entries()).map(([year, months]) => ({
    year: new Date(year),
    months: Array.from(months.entries()).map(([month, entries]) => ({
      month: new Date(month),
      entries,
    })),
  }));
}
