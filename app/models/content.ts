import { type } from "arktype";

const shared = type({
  id: "string",
  published_at: "Date | null",
  html: "string",
  slug: "string",
});

export const note = type({
  type: "'note'",
  title: "string",
}).and(shared);

export const content = note;

export const published_content = content
  .omit("published_at")
  .and({ published_at: "Date" });

export const parse_published_content = type({
  id: "string",
  type: "string",
  slug: "string",
  published_at: "Date | null",
  metadata: type({
    key: "string",
    value: "string",
  }).array(),
})
  .array()
  .pipe((list) => {
    return list.map((content) => {
      return {
        id: content.id,
        type: content.type,
        slug: content.slug,
        published_at: content.published_at,
        ...Object.fromEntries(
          content.metadata.map((meta) => [meta.key, meta.value])
        ),
      };
    });
  })
  .pipe(published_content.array());
