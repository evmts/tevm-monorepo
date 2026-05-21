// smithers-source: seeded
// smithers-display-name: Plan
/** @jsxImportSource smithers-orchestrator */
import { createSmithers } from "smithers-orchestrator";
import { z } from "zod/v4";
import { agents } from "../agents";
import PlanPrompt from "../prompts/plan.mdx";

const planOutputSchema = z.looseObject({
  summary: z.string(),
  steps: z.array(z.string()).default([]),
});

const inputSchema = z.object({
  prompt: z.string().default("Create an implementation plan."),
});

const { Workflow, Task, smithers } = createSmithers({
  input: inputSchema,
  plan: planOutputSchema,
});

export default smithers((ctx) => (
  <Workflow name="plan">
    <Task id="plan" output={planOutputSchema} agent={agents.smart}>
      <PlanPrompt prompt={ctx.input.prompt} />
    </Task>
  </Workflow>
));
