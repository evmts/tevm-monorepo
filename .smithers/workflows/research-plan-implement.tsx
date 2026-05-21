// smithers-source: seeded
// smithers-display-name: Research Plan Implement
/** @jsxImportSource smithers-orchestrator */
import { createSmithers } from "smithers-orchestrator";
import { z } from "zod/v4";
import { agents } from "../agents";
import { ValidationLoop, implementOutputSchema, validateOutputSchema } from "../components/ValidationLoop";
import { reviewOutputSchema } from "../components/Review";
import ResearchPrompt from "../prompts/research.mdx";
import PlanPrompt from "../prompts/plan.mdx";

const researchOutputSchema = z.looseObject({
  summary: z.string(),
  keyFindings: z.array(z.string()).default([]),
});

const planOutputSchema = z.looseObject({
  summary: z.string(),
  steps: z.array(z.string()).default([]),
});

const inputSchema = z.object({
  prompt: z.string().default("Implement the requested change."),
  tdd: z.boolean().default(false),
});

const { Workflow, Task, Sequence, smithers } = createSmithers({
  input: inputSchema,
  research: researchOutputSchema,
  plan: planOutputSchema,
  implement: implementOutputSchema,
  validate: validateOutputSchema,
  review: reviewOutputSchema,
});

export default smithers((ctx) => {
  const prompt = ctx.input.prompt;
  const tdd = ctx.input.tdd;

  const research = ctx.outputMaybe("research", { nodeId: "research" });
  const plan = ctx.outputMaybe("plan", { nodeId: "plan" });

  // Enrich plan prompt with research findings
  const planPromptParts = [
    prompt,
    research
      ? `RESEARCH FINDINGS:\n${research.summary}\n\nKey findings:\n${research.keyFindings.map((f: string) => `- ${f}`).join("\n")}`
      : null,
    tdd
      ? "IMPORTANT: Write tests FIRST. The plan MUST start with test steps before any implementation steps. Follow test-driven development: define expected behavior in tests, then implement to make them pass."
      : null,
  ];
  const planPrompt = planPromptParts.filter(Boolean).join("\n\n---\n");

  // Enrich implement prompt with both research and plan
  const implementPrompt = [
    prompt,
    research ? `RESEARCH FINDINGS:\n${research.summary}\n\nKey findings:\n${research.keyFindings.map((f: string) => `- ${f}`).join("\n")}` : null,
    plan ? `IMPLEMENTATION PLAN:\n${plan.summary}\n\nSteps:\n${plan.steps.map((s: string, i: number) => `${i + 1}. ${s}`).join("\n")}` : null,
    tdd ? "IMPORTANT: Follow the plan's test-first approach. Write or update tests before implementing production code." : null,
  ].filter(Boolean).join("\n\n---\n");

  // Validation loop feedback
  const validate = ctx.outputMaybe("validate", { nodeId: "impl:validate" });
  const reviews = ctx.outputs.review ?? [];

  const hasValidated = validate !== undefined;
  const validationPassed = hasValidated && validate.allPassed !== false;
  const anyApproved = reviews.length > 0 && reviews.some((r: any) => r.approved === true);
  const done = validationPassed && anyApproved;

  const feedbackParts: string[] = [];
  if (validate && !validationPassed && validate.failingSummary) {
    feedbackParts.push(`VALIDATION FAILED:\n${validate.failingSummary}`);
  }
  for (const review of reviews) {
    if (review.approved === false) {
      feedbackParts.push(`REVIEWER REJECTED:\n${review.feedback}`);
      if (review.issues?.length) {
        for (const issue of review.issues) {
          feedbackParts.push(`  [${issue.severity}] ${issue.title}: ${issue.description}${issue.file ? ` (${issue.file})` : ""}`);
        }
      }
    }
  }
  const feedback = feedbackParts.length > 0 ? feedbackParts.join("\n\n") : null;

  return (
    <Workflow name="research-plan-implement">
      <Sequence>
        <Task id="research" output={researchOutputSchema} agent={agents.smartTool}>
          <ResearchPrompt prompt={prompt} />
        </Task>
        <Task id="plan" output={planOutputSchema} agent={agents.smart}>
          <PlanPrompt prompt={planPrompt} />
        </Task>
        <ValidationLoop
          idPrefix="impl"
          prompt={implementPrompt}
          implementAgents={agents.smart}
          validateAgents={agents.cheapFast}
          reviewAgents={agents.smart}
          feedback={feedback}
          done={done}
          maxIterations={3}
        />
      </Sequence>
    </Workflow>
  );
});
