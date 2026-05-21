// smithers-source: seeded
// smithers-display-name: Debug
/** @jsxImportSource smithers-orchestrator */
import { createSmithers } from "smithers-orchestrator";
import { z } from "zod/v4";
import { agents } from "../agents";
import { ValidationLoop, implementOutputSchema, validateOutputSchema } from "../components/ValidationLoop";
import { reviewOutputSchema } from "../components/Review";

const inputSchema = z.object({
  prompt: z.string().default("Reproduce and fix the reported bug."),
});

const { Workflow, smithers } = createSmithers({
  input: inputSchema,
  implement: implementOutputSchema,
  validate: validateOutputSchema,
  review: reviewOutputSchema,
});

export default smithers((ctx) => (
  <Workflow name="debug">
    <ValidationLoop
      idPrefix="debug"
      prompt={ctx.input.prompt}
      implementAgents={agents.smart}
      validateAgents={agents.cheapFast}
      reviewAgents={agents.smart}
    />
  </Workflow>
));
