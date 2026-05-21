// smithers-source: seeded
/** @jsxImportSource smithers-orchestrator */
import { Parallel, Sequence, Task, type AgentLike } from "smithers-orchestrator";
import { z } from "zod/v4";
import FeatureTaskPrompt from "~/prompts/feature-task.mdx";

export const forEachFeatureResultSchema = z.looseObject({
  groupName: z.string(),
  result: z.string(),
  featuresCovered: z.array(z.string()).default([]),
  score: z.number().min(0).max(100).optional(),
});

export const forEachFeatureMergeSchema = z.looseObject({
  totalGroups: z.number().int(),
  summary: z.string(),
  mergedResult: z.string(),
  markdownBody: z.string(),
});

type ForEachFeatureProps = {
  idPrefix: string;
  agent: AgentLike | AgentLike[];
  features: Record<string, string[]>;
  prompt: React.ReactNode;
  maxConcurrency?: number;
  mergeAgent?: AgentLike | AgentLike[];
  granularity?: "group" | "feature";
};

type FeatureWorkItem = {
  id: string;
  groupName: string;
  features: string[];
};

function slugifyFeatureToken(value: string) {
  const normalized = value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
  return normalized.length > 0 ? normalized : "item";
}

export function ForEachFeature({
  idPrefix,
  agent,
  features,
  prompt,
  maxConcurrency = 5,
  mergeAgent,
  granularity = "group",
}: ForEachFeatureProps) {
  const featureEntries = Object.entries(features ?? {}).filter(([, groupFeatures]) => Array.isArray(groupFeatures) && groupFeatures.length > 0);
  const workItems: FeatureWorkItem[] = granularity === "feature"
    ? featureEntries.flatMap(([groupName, groupFeatures]) =>
        groupFeatures.map((feature, index) => ({
          id: `${slugifyFeatureToken(groupName)}:${slugifyFeatureToken(feature)}:${index}`,
          groupName,
          features: [feature],
        })),
      )
    : featureEntries.map(([groupName, groupFeatures], index) => ({
        id: `${slugifyFeatureToken(groupName)}:${index}`,
        groupName,
        features: groupFeatures,
      }));

  const mergeNeeds: Record<string, string> = Object.fromEntries(
    workItems.map((item, index) => [`item${index}`, `${idPrefix}:group:${item.id}`]),
  );
  const mergeDeps = Object.fromEntries(
    workItems.map((_, index) => [`item${index}`, forEachFeatureResultSchema]),
  ) as Record<string, typeof forEachFeatureResultSchema>;

  if (workItems.length === 0) {
    return (
      <Sequence>
        <Task id={`${idPrefix}:merge`} output={forEachFeatureMergeSchema}>
          {{
            totalGroups: 0,
            summary: "No feature groups were provided.",
            mergedResult: "",
            markdownBody: "# Feature Audit\n\nNo feature groups were provided.",
          }}
        </Task>
      </Sequence>
    );
  }

  return (
    <Sequence>
      <Parallel maxConcurrency={maxConcurrency}>
        {workItems.map((item) => (
          <Task
            key={`${idPrefix}:${item.id}`}
            id={`${idPrefix}:group:${item.id}`}
            output={forEachFeatureResultSchema}
            agent={agent}
            continueOnFail
          >
            <FeatureTaskPrompt
              granularity={granularity}
              groupName={item.groupName}
              features={item.features}
              prompt={prompt}
            />
          </Task>
        ))}
      </Parallel>
      <Task
        id={`${idPrefix}:merge`}
        output={forEachFeatureMergeSchema}
        agent={mergeAgent ?? agent}
        needs={mergeNeeds}
        deps={mergeDeps}
      >
        {(deps) => {
          const results = workItems.map((_, index) => deps[`item${index}`]);
          const totalGroups = new Set(workItems.map((item) => item.groupName)).size;
          return [
            "# Merge Feature Results",
            "",
            `Granularity: ${granularity}`,
            `Distinct groups: ${totalGroups}`,
            `Work items: ${workItems.length}`,
            `Set totalGroups to ${totalGroups}.`,
            "",
            "Combine the per-group results below into a single coherent output.",
            "Preserve group boundaries, highlight the most important gaps, and produce a markdownBody suitable for a report.",
            "",
            ...results.flatMap((result, index) => {
              const groupLabel = workItems[index]?.groupName ?? `Group ${index + 1}`;
              return [
                `## ${groupLabel}`,
                `Features covered: ${(result?.featuresCovered ?? []).join(", ") || "none"}`,
                result?.score != null ? `Score: ${result.score}` : null,
                result?.result ?? "",
                "",
              ].filter(Boolean);
            }),
          ].join("\n");
        }}
      </Task>
    </Sequence>
  );
}
