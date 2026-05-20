// smithers-source: seeded
// smithers-display-name: Audit
/** @jsxImportSource smithers-orchestrator */
import { createSmithers } from "smithers-orchestrator";
import { z } from "zod/v4";
import { agents } from "../agents";
import { ForEachFeature, forEachFeatureMergeSchema, forEachFeatureResultSchema } from "../components/ForEachFeature";
import AuditPrompt from "../prompts/audit.mdx";

const inputSchema = z.object({
  features: z.record(z.string(), z.array(z.string())).default({}),
  focus: z.string().default("code review"),
  additionalContext: z.string().nullable().default(null),
  maxConcurrency: z.number().int().default(5),
});

const { Workflow, smithers } = createSmithers({
  input: inputSchema,
  auditFeature: forEachFeatureResultSchema,
  audit: forEachFeatureMergeSchema,
});

export default smithers((ctx) => (
  <Workflow name="audit">
    <ForEachFeature
      idPrefix="audit"
      agent={agents.smart}
      features={ctx.input.features}
      prompt={<AuditPrompt focus={ctx.input.focus} additionalContext={ctx.input.additionalContext} />}
      maxConcurrency={ctx.input.maxConcurrency}
      mergeAgent={agents.smart}
    />
  </Workflow>
));
