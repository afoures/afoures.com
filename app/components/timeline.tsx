import { Link } from "react-router";
import { format } from "date-fns";
import { Region } from "./ui/semantic";

export interface TimelineProps {
  timeline: {
    year: Date;
    months: {
      month: Date;
      entries: {
        id: string;
        title: string;
        type: string;
        published_at: Date;
        pathname: string;
      }[];
    }[];
  }[];
}

export function Timeline({ timeline }: TimelineProps) {
  return (
    <div className="flex flex-col gap-20">
      {timeline.map(({ year, months }) => (
        <Region.Root
          key={year.toISOString()}
          element="section"
          region_id={format(year, "yyyy")}
        >
          <Region.Heading className="text-slate-500 text-2xl mb-4">
            {format(year, "yyyy")}
          </Region.Heading>
          <div className="flex flex-col gap-8">
            {months.map(({ month, entries }) => (
              <Region.Root
                key={month.toISOString()}
                element="section"
                region_id={format(month, "MMMM-yyyy").toLowerCase()}
              >
                <Region.Heading className="ml-auto w-fit text-lg text-slate-500 mb-2">
                  {format(month, "MMMM")}
                </Region.Heading>
                <div className="flex flex-col gap-2">
                  {entries.map((entry) => (
                    <div
                      key={entry.id}
                      className="group flex items-baseline gap-3 text-lg tabular-nums"
                    >
                      <Link to={{ pathname: entry.pathname }}>
                        {entry.title}
                      </Link>
                      <hr className="flex-1 border-slate-300 h-px border-dotted" />
                      <time dateTime={entry.published_at.toISOString()}>
                        {format(entry.published_at, "do")}
                      </time>
                    </div>
                  ))}
                </div>
              </Region.Root>
            ))}
          </div>
        </Region.Root>
      ))}
    </div>
  );
}
