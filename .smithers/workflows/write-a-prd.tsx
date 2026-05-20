// smithers-source: seeded
// smithers-display-name: Write a PRD
/** @jsxImportSource smithers-orchestrator */
// Inspired by Matt Pocock's write-a-prd skill (https://github.com/mattpocock/skills)
import { createSmithers } from "smithers-orchestrator";
import { z } from "zod/v4";
import { agents } from "../agents";
import { GrillMe, grillOutputSchema } from "../components/GrillMe";
import WriteAPrdPrompt from "../prompts/write-a-prd.mdx";

const WORKFLOW_ID = "write-a-prd";

const { Workflow, Task, smithers, outputs } = createSmithers({
  input: z.object({
    prompt: z.string().default("Describe the feature or product you want to specify."),
    maxIterations: z.number().int().default(10),
  }),
  grill: grillOutputSchema,
  prd: z.looseObject({
    title: z.string(),
    problemStatement: z.string(),
    solution: z.string(),
    userStories: z.array(z.object({
      actor: z.string(),
      feature: z.string(),
      benefit: z.string(),
    })).default([]),
    implementationDecisions: z.array(z.string()).default([]),
    testingDecisions: z.array(z.string()).default([]),
    observabilityRequirements: z.array(z.string()).default([]),
    metrics: z.array(z.string()).default([]),
    verificationStrategy: z.array(z.string()).default([]),
    modules: z.array(z.object({
      name: z.string(),
      description: z.string(),
      isDeepModule: z.boolean().default(false),
      needsTests: z.boolean().default(false),
    })).default([]),
    outOfScope: z.array(z.string()).default([]),
    furtherNotes: z.string().nullable().default(null),
    markdownBody: z.string(),
  }),
});

export default smithers((ctx) => {
  const prdHistory = ctx.outputs.prd || [];
  const currentDraft = prdHistory[prdHistory.length - 1];
  const previousDraft = prdHistory[prdHistory.length - 2];
  const isUnchanged = prdHistory.length > 1 && JSON.stringify(currentDraft) === JSON.stringify(previousDraft);

  return (
    <Workflow name={WORKFLOW_ID}>
      <GrillMe
        until={isUnchanged}
        idPrefix={WORKFLOW_ID}
        context={ctx.input.prompt}
        currentDraft={currentDraft}
        agent={agents.smart}
        output={outputs.grill}
        maxIterations={ctx.input.maxIterations}
      >
        <Task id={`${WORKFLOW_ID}:prd`} output={outputs.prd} agent={agents.smart}>
          <WriteAPrdPrompt
            context={ctx.input.prompt}
            additionalInstructions={`Explore the codebase to verify assertions before writing.
Prefer deep modules over shallow ones when sketching architecture.`}
          />
        </Task>
      </GrillMe>
    </Workflow>
  );
});
