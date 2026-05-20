/** @jsxImportSource smithers-orchestrator */
import { Loop, Sequence, Task, type AgentLike, type OutputTarget } from "smithers-orchestrator";
import { z } from "zod/v4";
import GrillMeSkill from "../prompts/grill-me.mdx";
import AskUserInstructions from "../prompts/ask-user-instructions.mdx";

export const grillOutputSchema = z.looseObject({
  question: z.string(),
  recommendedAnswer: z.string().nullable().default(null),
  branch: z.string().nullable().default(null),
  resolved: z.boolean().default(false),
  questionsAsked: z.number().int().default(0),
  sharedUnderstanding: z.string().nullable().default(null),
});

type GrillMeProps = {
  idPrefix: string;
  context: string;
  currentDraft?: any;
  agent: AgentLike | AgentLike[];
  output: OutputTarget;
  maxIterations?: number;
  children?: React.ReactNode;
  until?: boolean;
};

export function GrillMe({
  idPrefix,
  context,
  currentDraft,
  agent,
  output,
  maxIterations = 1,
  children,
  until = false,
}: GrillMeProps) {
  return (
    <Sequence>
      <Loop until={until} maxIterations={maxIterations}>
        <Task id={`${idPrefix}:grill`} output={output} agent={agent}>
          <GrillMeSkill />
          <AskUserInstructions />
          {context}
          {currentDraft && `

## Current Progress
Here is the result of the previous iteration:

\`\`\`json
${JSON.stringify(currentDraft, null, 2)}
\`\`\`

Review this result. If it completely fulfills the requirements, you can stop asking questions and mark resolved: true. Otherwise, I want you to further grill me so we can improve it.`}
        </Task>
        {children}
      </Loop>
    </Sequence>
  );
}
