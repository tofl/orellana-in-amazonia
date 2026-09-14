#!/usr/bin/env node
import { spawn } from "node:child_process";

const args = process.argv.slice(2);
if (!args.length) {
  console.error("usage: with-app-env.mjs <command> [...args]");
  process.exit(1);
}

const child = spawn(args[0], args.slice(1), {
  stdio: "inherit",
  env: process.env,
  shell: false,
});
child.on("exit", (code, signal) => {
  if (signal) process.exit(1);
  process.exit(code ?? 1);
});
