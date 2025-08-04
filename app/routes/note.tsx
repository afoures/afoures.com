import { get_note } from "~/use-cases/get-note";
import type { Route } from "./+types/note";
import * as ctx from "~/context";
import { useState, type ReactNode } from "react";
import { Region } from "~/components/ui/semantic";
import { format } from "date-fns";
import { Link } from "react-router";
import { unified } from "unified";
import rehype_parse from "rehype-parse";
import rehype_react from "rehype-react";
import react_jsx_runtime from "react/jsx-runtime";

export async function loader({ params, context }: Route.LoaderArgs) {
  const db = context.get(ctx.db);
  const note = await get_note({ db }, { slug: params.slug });
  if (!note) {
    throw new Response(null, { status: 404 });
  }

  return { note };
}

export default function Note({ loaderData: { note } }: Route.ComponentProps) {
  const [content] = useState(() => {
    const parsed = unified()
      .use(rehype_parse, { fragment: true })
      .use(rehype_react, {
        ...react_jsx_runtime,
        components: {
          region: Region.Root,
          heading: Region.Heading,
        },
      })
      .processSync(note.html);
    return parsed.result as ReactNode;
  });

  return (
    <Region.Root element="main" region_id={note.slug}>
      <div className="flex flex-col sm:flex-row items-baseline gap-2 sm:gap-6 mb-20">
        <Link to="/" aria-label="Go back" className="mb-6 sm:mb-0">
          <svg
            width="22"
            height="22"
            viewBox="0 0 15 15"
            fill="none"
            className="text-slate-600"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M6.85355 3.14645C7.04882 3.34171 7.04882 3.65829 6.85355 3.85355L3.70711 7H12.5C12.7761 7 13 7.22386 13 7.5C13 7.77614 12.7761 8 12.5 8H3.70711L6.85355 11.1464C7.04882 11.3417 7.04882 11.6583 6.85355 11.8536C6.65829 12.0488 6.34171 12.0488 6.14645 11.8536L2.14645 7.85355C1.95118 7.65829 1.95118 7.34171 2.14645 7.14645L6.14645 3.14645C6.34171 2.95118 6.65829 2.95118 6.85355 3.14645Z"
              fill="currentColor"
              stroke="currentColor"
              strokeWidth={0.4}
              fillRule="evenodd"
              clipRule="evenodd"
            ></path>
          </svg>
        </Link>
        <Region.Heading className="text-4xl">{note.title}</Region.Heading>
        <time
          dateTime={note.published_at.toISOString()}
          className="sm:ml-auto italic text-slate-500"
        >
          {format(note.published_at, "yyyy-MM-dd")}
        </time>
      </div>
      <article className="prose prose-lg prose-slate prose-headings:font-normal prose-blockquote:font-normal">
        {content}
      </article>
    </Region.Root>
  );
}
