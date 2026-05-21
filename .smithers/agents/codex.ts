import { CodexAgent as SmithersCodexAgent } from "smithers-orchestrator";

// Built-in Codex CLI agent (cliEngine: "codex").
// Tweak `model`, `cwd`, or uncomment extra options below to match your setup.
export const CodexAgent = new SmithersCodexAgent({
  model: "gpt-5.3-codex",
  cwd: process.cwd(),
  skipGitRepoCheck: true,
  // systemPrompt: "Add shared instructions for every Codex run.",
  // sandbox: "workspace-write",
  // fullAuto: true,
});
