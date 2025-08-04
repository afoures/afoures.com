import type { Route } from "./+types/home";
import { Timeline } from "~/components/timeline";
import * as ctx from "~/context";
import { Region } from "~/components/ui/semantic";
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
    <Region.Root element="main">
      <Region.Heading className="sr-only">Homepage</Region.Heading>
      <Timeline timeline={timeline} />
    </Region.Root>
  );
}
