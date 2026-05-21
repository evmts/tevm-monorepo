import { Gateway, mdxPlugin } from "smithers-orchestrator";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

mdxPlugin();

const here = dirname(fileURLToPath(import.meta.url));
const projectRoot = resolve(here, "..");
process.chdir(projectRoot);

const { default: kanban } = await import("./workflows/kanban.tsx");

const parsedPort = Number(process.env.PORT ?? "7331");
const port = Number.isInteger(parsedPort) && parsedPort > 0 ? parsedPort : 7331;
const host = process.env.HOST ?? "127.0.0.1";

const gateway = new Gateway({ heartbeatMs: 15_000 });

function registerWorkflow(key: string, workflow: any, options?: any) {
  gateway.register(key, workflow, options);
}

registerWorkflow("kanban", kanban, {
  ui: {
    entry: resolve(here, "ui", "kanban.tsx"),
    title: "Kanban",
  },
});

await gateway.listen({ host, port });
console.log("Smithers Gateway listening on http://" + host + ":" + port);
console.log("Kanban UI mounted at http://" + host + ":" + port + "/workflows/kanban");
