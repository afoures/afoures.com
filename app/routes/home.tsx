import type { Route } from "./+types/home";
import { Timeline } from "~/components/timeline";
import * as ctx from "~/context";
import { Heading, Region } from "~/components/ui/region";
import { find_published_content } from "~/use-cases/find-published-content";

export async function loader({ context }: Route.LoaderArgs) {
  const db = context.get(ctx.db);
  const entries = await find_published_content({
    db,
  });

  return { timeline: entries };
}

export default function Home({
  loaderData: { timeline },
}: Route.ComponentProps) {
  return (
    <Region as="main">
      <Heading className="sr-only">Homepage</Heading>
      <Timeline timeline={timeline} />
    </Region>
  );
}
