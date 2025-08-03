import fs from "node:fs";
import path from "node:path";

export function find_git_root(start_dir = process.cwd()) {
  let current_dir = path.resolve(start_dir);

  function has_git_dir(dir: string) {
    const git_path = path.join(dir, ".git");
    return fs.existsSync(git_path) && fs.statSync(git_path).isDirectory();
  }

  while (true) {
    if (has_git_dir(current_dir)) {
      return current_dir;
    }

    const parent_dir = path.dirname(current_dir);
    if (parent_dir === current_dir) {
      throw new Error("could not find any root git folder.");
    }

    current_dir = parent_dir;
  }
}
