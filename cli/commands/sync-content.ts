import path from "node:path";
import { type } from "arktype";
import { Command } from "commander";
import { find_git_root } from "../utils/find-git-root";
import * as database from "../utils/database";
import { eq } from "drizzle-orm";
import { processor } from "../utils/unified-processor";
import fs from "node:fs/promises";

const shared_frontmatter = type({
  published_at: "string.date | null",
});

const note_frontmatter = type({
  type: "'note'",
});

const parse_frontmatter = shared_frontmatter.and(note_frontmatter);

async function bundle_content(folder: string) {
  const file = await fs.readFile(
    path.format({ dir: folder, name: "index.md" })
  );

  const processed_file = await processor.process(file);
  const frontmatter = parse_frontmatter(processed_file.data.frontmatter);
  if (frontmatter instanceof type.errors) {
    throw new Error(frontmatter.summary);
  }

  return {
    slug: path.basename(folder),
    ...frontmatter,
    html: processed_file.value.toString(),
  };
}

async function save_content(
  content: {
    html: string;
    slug: string;
  } & typeof parse_frontmatter.infer,
  options: { remote: boolean; root: string }
) {
  const db: database.Database = options.remote
    ? database.remote()
    : database.local({ root: options.root });

  const { type, slug, published_at, ...metadata } = content;

  const inserted_content = await db
    .insert(database.schema.content)
    .values({
      slug: slug,
      type: type,
      published_at: published_at ? new Date(published_at) : null,
    })
    .onConflictDoUpdate({
      target: [database.schema.content.slug, database.schema.content.type],
      set: {
        published_at: published_at ? new Date(published_at) : null,
      },
    })
    .returning({ id: database.schema.content.id });

  const content_id = inserted_content.at(0)?.id;
  if (!content_id) throw new Error(`...`);

  await db
    .delete(database.schema.content_metadata)
    .where(eq(database.schema.content_metadata.related_content_id, content_id));

  await db.insert(database.schema.content_metadata).values(
    Object.entries(metadata).map(([key, value]) => ({
      key,
      value,
      related_content_id: content_id,
    }))
  );

  const result = await db
    .select()
    .from(database.schema.content)
    .where(eq(database.schema.content.id, content_id));
}

export default new Command("sync_content")
  .argument<Array<string>>(
    "<string...>",
    "folders to synchronize",
    (value, previous) => previous.concat([value]),
    []
  )
  .option("--remote", "uses remote database", false)
  .action(async (folders: Array<string>, options: { remote: boolean }) => {
    const root = find_git_root();

    for (const folder of folders) {
      const full_path = path.join(root, folder);

      console.log(`syncing ${folder}`);
      const content = await bundle_content(full_path);
      await save_content(content, { root, remote: options.remote });
      console.log(`  synced ${content.type}`);
    }
  });
