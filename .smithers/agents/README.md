# Agent Config

These files export the configured agent instances used by your Smithers workflows.

- `claude-code.ts`, `codex.ts`, and `gemini.ts` are user-owned config.
- Edit them to pin models, set `cwd`, add a shared `systemPrompt`, or enable engine-specific flags.
- `index.ts` re-exports all three so root-level files can import from `./agents`.

Examples:

```ts
import { ClaudeCodeAgent } from "./agents";
import { CodexAgent } from "./agents/codex";
```

Inside `.smithers/workflows/*`, use `../agents` or `../agents/<name>` instead.

`smithers init` and `smithers init --agents-only` only create missing files in this directory.
Existing files here are left alone so your custom agent config is preserved.
