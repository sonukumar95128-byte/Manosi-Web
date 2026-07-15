import { spawn } from "node:child_process";

const commands = [
  ["api", "node", ["server.mjs"]],
  ["web", "node", ["node_modules/vite/bin/vite.js", "--host", "127.0.0.1", "--port", "5174"]],
];

const children = commands.map(([name, command, args]) => {
  const child = spawn(command, args, {
    cwd: process.cwd(),
    shell: true,
    stdio: "inherit",
    env: process.env,
  });
  child.on("exit", (code) => {
    if (code) console.log(`${name} stopped with code ${code}`);
  });
  return child;
});

function stop() {
  for (const child of children) child.kill();
}

process.on("SIGINT", () => {
  stop();
  process.exit(0);
});

process.on("SIGTERM", () => {
  stop();
  process.exit(0);
});
