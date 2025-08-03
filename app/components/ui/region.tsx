import {
  createContext,
  createElement,
  useContext,
  useId,
  type ComponentPropsWithoutRef,
} from "react";

const HeadingIdContext = createContext<string | undefined>(undefined);
const HeadingLevelContext = createContext<number>(0);

export function Region<
  As extends "div" | "main" | "section" | "article" | "aside" = "div"
>({
  region_id,
  as: as,
  ...props
}: ComponentPropsWithoutRef<NoInfer<As>> & {
  region_id?: string;
  as?: As;
}) {
  const internal_id = useId();
  const heading_id = region_id ?? `region-${internal_id}`;

  const heading_level = useContext(HeadingLevelContext);
  const next_level = heading_level + 1;

  const element = as ?? "div";

  return (
    <HeadingIdContext.Provider value={heading_id}>
      <HeadingLevelContext.Provider value={next_level}>
        {createElement(element, {
          ...props,
          role: element === "div" ? "region" : undefined,
          "aria-labelledby": heading_id,
        })}
      </HeadingLevelContext.Provider>
    </HeadingIdContext.Provider>
  );
}

export type HeadingProps = React.HTMLAttributes<HTMLHeadingElement> & {
  level?: number | "auto";
};

export function Heading({ level = "auto", ...props }: HeadingProps) {
  const id = useContext(HeadingIdContext);
  const heading_level = useContext(HeadingLevelContext);

  if (id !== undefined && props.id !== undefined && id !== props.id) {
    // we need to ensure if we pass an ID to the Heading we must pass the same ID to the parent Region
    // if we don't do this the ID and labelledby will not match
    throw new Error(
      "When wrapping a Heading in a Region, ensure you provide the same `id` to both components."
    );
  }

  if (level === "auto" && heading_level === 0) {
    throw new Error(
      "To use auto heading levels wrap your Heading in a Region."
    );
  }

  if (typeof level === "number" && level <= 0) {
    throw new Error(
      "The level of a Heading must be a positive value greater than zero."
    );
  }

  const actual_level = level === "auto" ? heading_level : level;

  if (actual_level <= 6) {
    return createElement(`h${actual_level}`, {
      ...props,
      id: id ?? props.id,
    });
  }

  return createElement("div", {
    ...props,
    id: id ?? props.id,
    role: "heading",
    "aria-level": actual_level,
  });
}
