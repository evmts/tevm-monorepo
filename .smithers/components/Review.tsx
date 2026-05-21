// smithers-source: seeded
/** @jsxImportSource smithers-orchestrator */
import { Parallel, Task, type AgentLike } from "smithers-orchestrator";
import { z } from "zod/v4";
import ReviewPrompt from "../prompts/review.mdx";

const reviewIssueSchema = z.object({
  severity: z.enum(["critical", "major", "minor", "nit"]),
  title: z.string(),
  file: z.string().nullable().default(null),
  description: z.string(),
});

export const reviewOutputSchema = z.object({
  reviewer: z.string(),
  approved: z.boolean(),
  feedback: z.string(),
  issues: z.array(reviewIssueSchema).default([]),
});

type ReviewProps = {
  idPrefix: string;
  prompt: unknown;
  agents: AgentLike[];
};

export function Review({ idPrefix, prompt, agents }: ReviewProps) {
  const promptText = typeof prompt === "string" ? prompt : JSON.stringify(prompt ?? null);
  return (
    <Parallel>
      {agents.map((agent, index) => (
        <Task
          key={`${idPrefix}:${index}`}
          id={`${idPrefix}:${index}`}
          output={reviewOutputSchema}
          agent={agent}
          continueOnFail
        >
          <ReviewPrompt reviewer={`reviewer-${index + 1}`} prompt={promptText} />
        </Task>
      ))}
    </Parallel>
  );
}
