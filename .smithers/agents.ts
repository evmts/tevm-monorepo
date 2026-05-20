// smithers-source: generated
// Account providers (camelCase labels) come from ~/.smithers/accounts.json — managed via `smithers agent add|list|remove`.
import { homedir } from "node:os";
import path from "node:path";
import { type AgentLike, PiAgent as SmithersPiAgent, KimiAgent as SmithersKimiAgent, AmpAgent as SmithersAmpAgent, ClaudeCodeAgent as SmithersClaudeCodeAgent } from "smithers-orchestrator";
import { ClaudeCodeAgent } from "./agents/claude-code";
import { CodexAgent } from "./agents/codex";
import { GeminiAgent } from "./agents/gemini";

export { ClaudeCodeAgent } from "./agents/claude-code";
export { CodexAgent } from "./agents/codex";
export { GeminiAgent } from "./agents/gemini";

export const providers = {
  claude: ClaudeCodeAgent,
  codex: CodexAgent,
  pi: new SmithersPiAgent({ provider: "openai", model: "gpt-5.3-codex" }),
  kimi: new SmithersKimiAgent({ model: "kimi-latest" }),
  amp: new SmithersAmpAgent(),
  claudeSonnet: new SmithersClaudeCodeAgent({ model: "claude-sonnet-4-7", cwd: process.cwd() }),
  kimi1: new SmithersKimiAgent({ model: "kimi-latest", configDir: path.join(homedir(), ".smithers/accounts/kimi-1"), cwd: process.cwd() }),
} as const;

export const agents = {
	cheapFast: [providers.kimi, providers.claudeSonnet, providers.kimi1],
	smart: [providers.codex, providers.claude],
	smartTool: [providers.claude, providers.codex],
} as const satisfies Record<string, AgentLike[]>;
