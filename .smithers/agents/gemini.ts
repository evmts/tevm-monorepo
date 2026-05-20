import { GeminiAgent as SmithersGeminiAgent } from "smithers-orchestrator";

// Built-in Gemini CLI agent (cliEngine: "gemini").
// Tweak `model`, `cwd`, or uncomment extra options below to match your setup.
export const GeminiAgent = new SmithersGeminiAgent({
  model: "gemini-3.1-pro-preview",
  cwd: process.cwd(),
  // systemPrompt: "Add shared instructions for every Gemini run.",
  // approvalMode: "yolo",
  // allowedTools: ["read_file", "write_file"],
});
