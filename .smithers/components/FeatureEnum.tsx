// smithers-source: seeded
/** @jsxImportSource smithers-orchestrator */
import { Sequence, Task, type AgentLike } from "smithers-orchestrator";
import { z } from "zod/v4";
import FeatureEnumScanPrompt from "../prompts/feature-enum-scan.mdx";
import FeatureEnumRefinePrompt from "../prompts/feature-enum-refine.mdx";

export const featureEnumOutputSchema = z.looseObject({
  featureGroups: z.record(z.string(), z.array(z.string())).default({}),
  totalFeatures: z.number().int().default(0),
  lastCommitHash: z.string().nullable().optional(),
  markdownBody: z.string(),
});

type FeatureEnumProps = {
  idPrefix: string;
  agent: AgentLike | AgentLike[];
  refineIterations?: number;
  existingFeatures?: Record<string, string[]> | null;
  lastCommitHash?: string | null;
  additionalContext?: string;
};

const memoryNamespace = { kind: "workflow", id: "feature-enum" } as const;

export function FeatureEnum({
  idPrefix,
  agent,
  refineIterations,
  existingFeatures = null,
  lastCommitHash = null,
  additionalContext = "",
}: FeatureEnumProps) {
  const isFirstRun = !existingFeatures;
  const totalRefineIterations = Math.max(1, refineIterations ?? (isFirstRun ? 5 : 1));
  const scanTaskId = `${idPrefix}:scan`;
  const refineTaskIds = Array.from({ length: totalRefineIterations }, (_, index) => `${idPrefix}:refine:${index + 1}`);
  const finalTaskId = `${idPrefix}:result`;

  return (
    <Sequence>
      {isFirstRun && (
        <Task
          id={scanTaskId}
          output={featureEnumOutputSchema}
          agent={agent}
          memory={{
            remember: {
              namespace: memoryNamespace,
              key: scanTaskId,
            },
          }}
        >
          <FeatureEnumScanPrompt additionalContext={additionalContext} />
        </Task>
      )}

      {refineTaskIds.map((taskId, index) => {
        const previousTaskId = index === 0
          ? (isFirstRun ? scanTaskId : null)
          : refineTaskIds[index - 1];

        if (previousTaskId) {
          return (
            <Task
              key={taskId}
              id={taskId}
              output={featureEnumOutputSchema}
              agent={agent}
              needs={{ previous: previousTaskId }}
              deps={{ previous: featureEnumOutputSchema }}
              memory={{
                recall: {
                  namespace: memoryNamespace,
                  query: "feature inventory feature enum grouped features",
                  topK: 5,
                },
                remember: {
                  namespace: memoryNamespace,
                  key: taskId,
                },
              }}
            >
              {(deps) => (
                <FeatureEnumRefinePrompt
                  existingFeatures={deps.previous.featureGroups}
                  lastCommitHash={deps.previous.lastCommitHash ?? lastCommitHash}
                  iteration={index + 1}
                />
              )}
            </Task>
          );
        }

        return (
          <Task
            key={taskId}
            id={taskId}
            output={featureEnumOutputSchema}
            agent={agent}
            memory={{
              recall: {
                namespace: memoryNamespace,
                query: "feature inventory feature enum grouped features",
                topK: 5,
              },
              remember: {
                namespace: memoryNamespace,
                key: taskId,
              },
            }}
          >
            <FeatureEnumRefinePrompt
              existingFeatures={existingFeatures ?? {}}
              lastCommitHash={lastCommitHash}
              iteration={index + 1}
            />
          </Task>
        );
      })}

      <Task
        id={finalTaskId}
        output={featureEnumOutputSchema}
        needs={{ final: refineTaskIds[refineTaskIds.length - 1] ?? scanTaskId }}
        deps={{ final: featureEnumOutputSchema }}
      >
        {(deps) => deps.final}
      </Task>
    </Sequence>
  );
}
