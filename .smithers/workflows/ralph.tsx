// smithers-source: seeded
// smithers-display-name: Ralph
/** @jsxImportSource smithers-orchestrator */
import { createSmithers } from "smithers-orchestrator";
import { z } from "zod/v4";
import { agents } from "../agents";

const ralphOutputSchema = z.looseObject({
  summary: z.string(),
});

const inputSchema = z.object({
  prompt: z.string().default("Continue working on the current task."),
});

const { Workflow, Task, Loop, smithers } = createSmithers({
  input: inputSchema,
  ralph: ralphOutputSchema,
});

export default smithers((ctx) => (
  <Workflow name="ralph">
    <Loop until={false} maxIterations={Infinity}>
      <Task id="ralph" output={ralphOutputSchema} agent={agents.smart}>
        {ctx.input.prompt}
      </Task>
    </Loop>
  </Workflow>
));
