// smithers-source: seeded
// smithers-display-name: Review
/** @jsxImportSource smithers-orchestrator */
import { createSmithers } from "smithers-orchestrator";
import { z } from "zod/v4";
import { agents } from "../agents";
import { Review, reviewOutputSchema } from "../components/Review";

const inputSchema = z.object({
  prompt: z.string().default("Review the current repository changes."),
});

const { Workflow, smithers } = createSmithers({
  input: inputSchema,
  review: reviewOutputSchema,
});

export default smithers((ctx) => (
  <Workflow name="review">
    <Review
      idPrefix="review"
      prompt={ctx.input.prompt}
      agents={agents.smart}
    />
  </Workflow>
));
