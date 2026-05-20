// smithers-source: seeded
// smithers-display-name: Feature Enum
/** @jsxImportSource smithers-orchestrator */
import { createSmithers } from "smithers-orchestrator";
import { z } from "zod/v4";
import { agents } from "../agents";
import { FeatureEnum, featureEnumOutputSchema } from "../components/FeatureEnum";

const inputSchema = z.object({
  refineIterations: z.number().int().default(1),
  existingFeatures: z.record(z.string(), z.array(z.string())).nullable().default(null),
  lastCommitHash: z.string().nullable().default(null),
  additionalContext: z.string().default(""),
});

const { Workflow, smithers } = createSmithers({
  input: inputSchema,
  featureEnum: featureEnumOutputSchema,
});

export default smithers((ctx) => (
  <Workflow name="feature-enum">
    <FeatureEnum
      idPrefix="feature-enum"
      agent={agents.smartTool}
      refineIterations={ctx.input.refineIterations}
      existingFeatures={ctx.input.existingFeatures}
      lastCommitHash={ctx.input.lastCommitHash}
      additionalContext={ctx.input.additionalContext}
    />
  </Workflow>
));
