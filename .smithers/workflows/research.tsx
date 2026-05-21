// smithers-source: seeded
// smithers-display-name: Research
/** @jsxImportSource smithers-orchestrator */
import { createSmithers } from "smithers-orchestrator";
import { z } from "zod/v4";
import { agents } from "../agents";
import ResearchPrompt from "../prompts/research.mdx";

const researchOutputSchema = z.looseObject({
  summary: z.string(),
  keyFindings: z.array(z.string()).default([]),
});

const inputSchema = z.object({
  prompt: z.string().default("Research the given topic."),
});

const { Workflow, Task, smithers } = createSmithers({
  input: inputSchema,
  research: researchOutputSchema,
});

export default smithers((ctx) => (
  <Workflow name="research">
    <Task id="research" output={researchOutputSchema} agent={agents.smartTool}>
      <ResearchPrompt prompt={ctx.input.prompt} />
    </Task>
  </Workflow>
));
