import { Link } from "react-router";
import { format } from "date-fns";
import { Heading, Region } from "./ui/region";

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
        <Region
          as="section"
          key={year.toISOString()}
          region_id={format(year, "yyyy")}
        >
          <Heading className="text-slate-500 text-2xl mb-4">
            {format(year, "yyyy")}
          </Heading>
          <div className="flex flex-col gap-8">
            {months.map(({ month, entries }) => (
              <Region
                key={month.toISOString()}
                region_id={format(month, "MMMM-yyyy").toLowerCase()}
              >
                <Heading className="ml-auto w-fit text-lg text-slate-500 mb-2">
                  {format(month, "MMMM")}
                </Heading>
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
              </Region>
            ))}
          </div>
        </Region>
      ))}
    </div>
  );
}
