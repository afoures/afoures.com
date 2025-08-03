import type { Node, Parent } from "unist";
import { findAfter } from "unist-util-find-after";
import { visit } from "unist-util-visit";
import slugify from "slugify";

const MAX_HEADING_DEPTH = 20;

function plugin() {
  return transform;
}

type HeadingNode = Node & {
  type: "heading";
  depth: number;
  children: { type: "text"; value: string }[];
};

function is_heading_node(node: Node): node is HeadingNode {
  return (
    node.type === "heading" && "depth" in node && typeof node.depth === "number"
  );
}

function transform(tree: Node) {
  for (let depth = MAX_HEADING_DEPTH; depth > 0; depth--) {
    visit(
      tree,
      (node: Node): node is HeadingNode => {
        return is_heading_node(node) && node.depth === depth;
      },
      sectionize
    );
  }
}

function sectionize(
  node: HeadingNode,
  index: number | undefined,
  parent: Parent
) {
  const start = node;
  const start_index = index;
  const depth = start.depth;

  const is_end = (node: Node) =>
    (is_heading_node(node) && node.depth <= depth) || node.type === "export";

  const end = findAfter(parent, start, is_end);
  const end_index = parent.children.indexOf(end!);

  const between = [
    {
      ...start,
      data: {
        ...start.data,
        hName: "Heading",
      },
    },
    ...parent.children.slice(
      start_index! + 1,
      end_index > 0 ? end_index : undefined
    ),
  ];

  const region_id = slugify(
    node.children
      .filter((node) => node.type === "text")
      .map((node) => node.value)
      .join(" "),
    {
      lower: true,
      trim: true,
    }
  );

  const section = {
    type: "section",
    depth: depth,
    children: between,
    data: {
      hName: "Region",
      hProperties: { as: "section", region_id },
    },
  };

  parent.children.splice(start_index!, section.children.length, section);
}

export default plugin;
