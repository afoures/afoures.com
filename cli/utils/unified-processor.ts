import { unified } from "unified";
import remark_parse from "remark-parse";
import remark_rehype from "remark-rehype";
import rehype_stringify from "rehype-stringify";
import remark_frontmatter from "remark-frontmatter";
import remark_parse_frontmatter from "remark-parse-frontmatter";
import remark_sectionize from "./remark-sectionize";

export const processor = unified()
  .use(remark_parse)
  .use(remark_frontmatter, ["yaml"])
  .use(remark_parse_frontmatter)
  .use(remark_sectionize)
  .use(remark_rehype)
  .use(rehype_stringify);
