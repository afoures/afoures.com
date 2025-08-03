import { Command } from "commander";
import sync_content from "./commands/sync-content";

const program = new Command();

program.name("cli").version("0.1.0");

program.addCommand(sync_content);

program.parse();
