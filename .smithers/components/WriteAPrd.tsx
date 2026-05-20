// smithers-source: seeded
// Inspired by Matt Pocock's write-a-prd skill (https://github.com/mattpocock/skills)
/** @jsxImportSource smithers-orchestrator */
import { Sequence, Task, type AgentLike } from "smithers-orchestrator";
import { z } from "zod/v4";
import WriteAPrdPrompt from "../prompts/write-a-prd.mdx";

const userStorySchema = z.object({
  actor: z.string(),
  feature: z.string(),
  benefit: z.string(),
});

const moduleSketchSchema = z.object({
  name: z.string(),
  description: z.string(),
  isDeepModule: z.boolean().default(false),
  needsTests: z.boolean().default(false),
});

export const prdOutputSchema = z.looseObject({
  title: z.string(),
  problemStatement: z.string(),
  solution: z.string(),
  userStories: z.array(userStorySchema).default([]),
  implementationDecisions: z.array(z.string()).default([]),
  testingDecisions: z.array(z.string()).default([]),
  modules: z.array(moduleSketchSchema).default([]),
  outOfScope: z.array(z.string()).default([]),
  furtherNotes: z.string().nullable().default(null),
  markdownBody: z.string(),
});

type WriteAPrdProps = {
  idPrefix: string;
  context: string;
  agent: AgentLike | AgentLike[];
  exploreCodebase?: boolean;
  interviewFirst?: boolean;
  maxInterviewQuestions?: number;
  moduleDepthGuidance?: boolean;
  outputFormat?: "markdown" | "json";
};

export function WriteAPrd({
  idPrefix,
  context,
  agent,
  exploreCodebase = true,
  interviewFirst = true,
  maxInterviewQuestions = 20,
  moduleDepthGuidance = true,
  outputFormat = "markdown",
}: WriteAPrdProps) {
  const additionalInstructions = [
    exploreCodebase && "Explore the codebase to verify assertions before writing.",
    interviewFirst && `Interview the user first (up to ${maxInterviewQuestions} questions).`,
    moduleDepthGuidance && "Prefer deep modules over shallow ones when sketching architecture.",
    outputFormat === "json" && "Return structured JSON in addition to the markdown body.",
  ].filter(Boolean).join("\n");

  return (
    <Sequence>
      <Task
        id={`${idPrefix}:prd`}
        output={prdOutputSchema}
        agent={agent}
      >
        <WriteAPrdPrompt context={context} additionalInstructions={additionalInstructions} />
      </Task>
    </Sequence>
  );
}
