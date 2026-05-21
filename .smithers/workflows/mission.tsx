// smithers-source: seeded
// smithers-display-name: Mission
/** @jsxImportSource smithers-orchestrator */
import { createSmithers } from "smithers-orchestrator";
import { z } from "zod/v4";
import { agents } from "../agents";
import AskUserInstructions from "../prompts/ask-user-instructions.mdx";
import MissionPlanPrompt from "../prompts/mission-plan.mdx";
import MissionWorkerPrompt from "../prompts/mission-worker.mdx";
import MissionIntegratePrompt from "../prompts/mission-integrate.mdx";
import MissionValidatePrompt from "../prompts/mission-validate.mdx";
import MissionFollowUpPrompt from "../prompts/mission-follow-up.mdx";
import MissionFinalPrompt from "../prompts/mission-final.mdx";

const missionFeatureSchema = z.looseObject({
  id: z.string().default("feature"),
  title: z.string().default("Feature"),
  instructions: z.string().default("Complete the assigned feature."),
  files: z.array(z.string()).default([]),
  validation: z.array(z.string()).default([]),
  workerType: z.enum(["implementation", "test", "docs", "research"]).default("implementation"),
  canRunInParallel: z.boolean().default(true),
});

const missionMilestoneSchema = z.looseObject({
  id: z.string().default("milestone"),
  title: z.string().default("Milestone"),
  objective: z.string().default("Complete this milestone."),
  features: z.array(missionFeatureSchema).default([]),
  validationPlan: z.array(z.string()).default([]),
});

const missionPlanSchema = z.looseObject({
  goal: z.string().default(""),
  summary: z.string().default("Mission plan created."),
  milestones: z.array(missionMilestoneSchema).default([]),
  assumptions: z.array(z.string()).default([]),
  risks: z.array(z.string()).default([]),
  outOfScope: z.array(z.string()).default([]),
  approvalNotes: z.string().nullable().default(null),
});

const missionApprovalSchema = z.looseObject({
  approved: z.boolean().default(false),
  note: z.string().nullable().default(null),
  decidedBy: z.string().nullable().default(null),
  decidedAt: z.string().nullable().default(null),
});

const missionFeatureResultSchema = z.looseObject({
  featureId: z.string().default("feature"),
  status: z.enum(["success", "partial", "failed"]).default("partial"),
  summary: z.string().default("Feature worker completed."),
  filesChanged: z.array(z.string()).default([]),
  commandsRun: z.array(z.string()).default([]),
  blockers: z.array(z.string()).default([]),
  reusableLearnings: z.array(z.string()).default([]),
});

const milestoneIntegrationSchema = z.looseObject({
  milestoneId: z.string().default("milestone"),
  status: z.enum(["integrated", "partial", "blocked"]).default("integrated"),
  summary: z.string().default("Milestone integrated."),
  mergedBranches: z.array(z.string()).default([]),
  conflictedBranches: z.array(z.string()).default([]),
  filesChanged: z.array(z.string()).default([]),
});

const milestoneValidationSchema = z.looseObject({
  milestoneId: z.string().default("milestone"),
  passed: z.boolean().default(true),
  summary: z.string().default("Validation completed."),
  checks: z.array(z.object({
    name: z.string(),
    status: z.enum(["passed", "failed", "skipped"]),
    details: z.string().nullable().default(null),
  })).default([]),
  regressions: z.array(z.string()).default([]),
  followUps: z.array(z.string()).default([]),
});

const missionFinalSchema = z.looseObject({
  status: z.enum(["completed", "partial", "cancelled"]).default("completed"),
  summary: z.string().default("Mission complete."),
  completedMilestones: z.number().int().default(0),
  totalMilestones: z.number().int().default(0),
  validationPassed: z.boolean().default(true),
  remainingRisks: z.array(z.string()).default([]),
  nextActions: z.array(z.string()).default([]),
  markdownBody: z.string().default(""),
});

const inputSchema = z.object({
  prompt: z.string().default("Describe the mission goal."),
  requirePlanApproval: z.boolean().default(true),
  maxMilestones: z.number().int().min(1).max(20).default(6),
  maxFeaturesPerMilestone: z.number().int().min(1).max(20).default(6),
  maxConcurrency: z.number().int().min(1).max(10).default(3),
  useWorktrees: z.boolean().default(false),
  baseBranch: z.string().default("main"),
});

const { Workflow, Task, Sequence, Parallel, Approval, Worktree, smithers, outputs } = createSmithers({
  input: inputSchema,
  missionPlan: missionPlanSchema,
  missionApproval: missionApprovalSchema,
  missionFeature: missionFeatureResultSchema,
  milestoneIntegration: milestoneIntegrationSchema,
  milestoneValidation: milestoneValidationSchema,
  missionFinal: missionFinalSchema,
});

const missionMemory = { kind: "workflow", id: "mission" } as const;

function slugify(value: unknown, fallback: string): string {
  const normalized = String(value ?? "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
  return normalized.length > 0 ? normalized : fallback;
}

function asStringArray(value: unknown): string[] {
  return Array.isArray(value) ? value.map((entry) => String(entry)).filter(Boolean) : [];
}

function normalizeFeature(feature: any, index: number): any {
  const title = typeof feature?.title === "string" && feature.title.length > 0
    ? feature.title
    : `Feature ${index + 1}`;
  return {
    id: slugify(feature?.id ?? title, `feature-${index + 1}`),
    title,
    instructions: typeof feature?.instructions === "string" && feature.instructions.length > 0
      ? feature.instructions
      : `Complete ${title}.`,
    files: asStringArray(feature?.files),
    validation: asStringArray(feature?.validation),
    workerType: ["implementation", "test", "docs", "research"].includes(feature?.workerType)
      ? feature.workerType
      : "implementation",
    canRunInParallel: feature?.canRunInParallel !== false,
  };
}

function normalizeMilestones(plan: any, maxMilestones: number, maxFeaturesPerMilestone: number): any[] {
  return (Array.isArray(plan?.milestones) ? plan.milestones : [])
    .slice(0, maxMilestones)
    .map((milestone: any, index: number) => {
      const title = typeof milestone?.title === "string" && milestone.title.length > 0
        ? milestone.title
        : `Milestone ${index + 1}`;
      const features = (Array.isArray(milestone?.features) ? milestone.features : [])
        .slice(0, maxFeaturesPerMilestone)
        .map((feature: any, featureIndex: number) => normalizeFeature(feature, featureIndex));
      return {
        id: slugify(milestone?.id ?? title, `milestone-${index + 1}`),
        title,
        objective: typeof milestone?.objective === "string" && milestone.objective.length > 0
          ? milestone.objective
          : title,
        validationPlan: asStringArray(milestone?.validationPlan),
        features: features.length > 0
          ? features
          : [normalizeFeature({ title, instructions: milestone?.objective ?? title }, 0)],
      };
    });
}

function featureTaskId(milestoneIndex: number, feature: any): string {
  return `mission:milestone:${milestoneIndex + 1}:feature:${feature.id}`;
}

function milestoneIntegrateId(milestoneIndex: number): string {
  return `mission:milestone:${milestoneIndex + 1}:integrate`;
}

function milestoneValidationId(milestoneIndex: number): string {
  return `mission:milestone:${milestoneIndex + 1}:validate`;
}

function milestoneFollowUpId(milestoneIndex: number): string {
  return `mission:milestone:${milestoneIndex + 1}:follow-up`;
}

function milestoneRevalidationId(milestoneIndex: number): string {
  return `mission:milestone:${milestoneIndex + 1}:revalidate`;
}

function featureNeeds(milestoneIndex: number, features: any[]): Record<string, string> {
  return Object.fromEntries(features.map((feature, index) => [`feature${index}`, featureTaskId(milestoneIndex, feature)]));
}

function featureDeps(features: any[]): Record<string, typeof missionFeatureResultSchema> {
  return Object.fromEntries(features.map((_, index) => [`feature${index}`, outputs.missionFeature]));
}

function workerAgentsFor(feature: any): any {
  if (feature.workerType === "research") return agents.smartTool;
  if (feature.workerType === "docs") return agents.cheapFast;
  return agents.smart;
}

function previousMilestoneSummary(ctx: any): string {
  const integrations = ctx.outputs.milestoneIntegration ?? [];
  const validations = ctx.outputs.milestoneValidation ?? [];
  return [
    ...integrations.map((entry: any) => `Integration: ${entry.summary}`),
    ...validations.map((entry: any) => `Validation: ${entry.passed ? "passed" : "failed"} - ${entry.summary}`),
  ].slice(-8).join("\n");
}

function milestoneIsTerminal(ctx: any, milestoneIndex: number): boolean {
  const revalidation = ctx.outputMaybe("milestoneValidation", { nodeId: milestoneRevalidationId(milestoneIndex) });
  if (revalidation) return true;
  const validation = ctx.outputMaybe("milestoneValidation", { nodeId: milestoneValidationId(milestoneIndex) });
  return Boolean(validation && validation.passed !== false);
}

function activeMilestoneIndex(ctx: any, milestones: any[]): number {
  for (let index = 0; index < milestones.length; index += 1) {
    if (!milestoneIsTerminal(ctx, index)) return index;
  }
  return milestones.length;
}

function renderFeatureWorker(ctx: any, plan: any, milestone: any, milestoneIndex: number, feature: any) {
  const taskId = featureTaskId(milestoneIndex, feature);
  const workerTask = (
    <Task
      key={taskId}
      id={taskId}
      output={outputs.missionFeature}
      agent={workerAgentsFor(feature)}
      timeoutMs={3_600_000}
      heartbeatTimeoutMs={900_000}
      continueOnFail
      memory={{
        recall: { namespace: missionMemory, query: `${plan.goal} ${milestone.title} ${feature.title}`, topK: 5 },
        remember: { namespace: missionMemory, key: taskId },
      }}
    >
      <MissionWorkerPrompt
        missionGoal={plan.goal || ctx.input.prompt}
        milestone={milestone}
        feature={feature}
        previousSummary={previousMilestoneSummary(ctx)}
      />
    </Task>
  );

  if (!(ctx.input.useWorktrees ?? false)) return workerTask;

  return (
    <Worktree
      key={taskId}
      id={`mission-worktree-${milestoneIndex + 1}-${feature.id}`}
      path={`.worktrees/mission-${milestoneIndex + 1}-${feature.id}`}
      branch={`mission/${milestoneIndex + 1}/${feature.id}`}
      baseBranch={ctx.input.baseBranch ?? "main"}
    >
      {workerTask}
    </Worktree>
  );
}

function renderMilestone(ctx: any, plan: any, milestone: any, milestoneIndex: number) {
  const features = milestone.features;
  const integrationId = milestoneIntegrateId(milestoneIndex);
  const validationId = milestoneValidationId(milestoneIndex);
  const integration = ctx.outputMaybe("milestoneIntegration", { nodeId: integrationId });
  const validation = ctx.outputMaybe("milestoneValidation", { nodeId: validationId });
  const needsFollowUp = Boolean(validation && validation.passed === false);

  return (
    <Sequence>
      <Parallel maxConcurrency={Math.min(ctx.input.maxConcurrency ?? 3, features.length)}>
        {features.map((feature: any) => renderFeatureWorker(ctx, plan, milestone, milestoneIndex, feature))}
      </Parallel>
      <Task
        id={integrationId}
        output={outputs.milestoneIntegration}
        agent={agents.smartTool}
        needs={featureNeeds(milestoneIndex, features)}
        deps={featureDeps(features)}
        timeoutMs={1_800_000}
        memory={{ remember: { namespace: missionMemory, key: integrationId } }}
      >
        {(deps: any) => {
          const results = features.map((_: any, index: number) => deps[`feature${index}`]);
          return (
            <MissionIntegratePrompt
              missionGoal={plan.goal || ctx.input.prompt}
              milestone={milestone}
              results={results}
              useWorktrees={ctx.input.useWorktrees ?? false}
            />
          );
        }}
      </Task>
      <Task
        id={validationId}
        output={outputs.milestoneValidation}
        agent={agents.smart}
        needs={{ integration: integrationId }}
        deps={{ integration: outputs.milestoneIntegration }}
        timeoutMs={1_800_000}
        heartbeatTimeoutMs={900_000}
        memory={{ remember: { namespace: missionMemory, key: validationId } }}
      >
        {(deps: any) => (
          <MissionValidatePrompt
            missionGoal={plan.goal || ctx.input.prompt}
            milestone={milestone}
            integration={deps.integration}
          />
        )}
      </Task>
      {needsFollowUp && (
        <Sequence>
          <Task
            id={milestoneFollowUpId(milestoneIndex)}
            output={outputs.missionFeature}
            agent={agents.smart}
            needs={{ validation: validationId }}
            deps={{ validation: outputs.milestoneValidation }}
            timeoutMs={1_800_000}
            memory={{ remember: { namespace: missionMemory, key: milestoneFollowUpId(milestoneIndex) } }}
          >
            {(deps: any) => (
              <MissionFollowUpPrompt
                missionGoal={plan.goal || ctx.input.prompt}
                milestone={milestone}
                validation={deps.validation}
              />
            )}
          </Task>
          <Task
            id={milestoneRevalidationId(milestoneIndex)}
            output={outputs.milestoneValidation}
            agent={agents.smart}
            needs={{ followUp: milestoneFollowUpId(milestoneIndex) }}
            deps={{ followUp: outputs.missionFeature }}
            timeoutMs={1_800_000}
            heartbeatTimeoutMs={900_000}
            memory={{ remember: { namespace: missionMemory, key: milestoneRevalidationId(milestoneIndex) } }}
          >
            {(deps: any) => (
              <MissionValidatePrompt
                missionGoal={plan.goal || ctx.input.prompt}
                milestone={milestone}
                integration={integration}
                followUp={deps.followUp}
              />
            )}
          </Task>
        </Sequence>
      )}
    </Sequence>
  );
}

function renderFinal(ctx: any, plan: any, milestones: any[]) {
  return (
    <Task id="mission:final" output={outputs.missionFinal} agent={agents.smartTool}>
      <MissionFinalPrompt
        plan={{ ...plan, milestones }}
        featureResults={ctx.outputs.missionFeature ?? []}
        integrationResults={ctx.outputs.milestoneIntegration ?? []}
        validationResults={ctx.outputs.milestoneValidation ?? []}
      />
    </Task>
  );
}

export default smithers((ctx) => {
  const plan = ctx.outputMaybe("missionPlan", { nodeId: "mission:plan" });
  const approval = ctx.outputMaybe("missionApproval", { nodeId: "mission:approve-plan" });
  const approvalRequired = ctx.input.requirePlanApproval;
  const approvalDenied = approvalRequired && approval && approval.approved === false;
  const approved = !approvalRequired || approval?.approved === true;
  const milestones = normalizeMilestones(plan, ctx.input.maxMilestones ?? 6, ctx.input.maxFeaturesPerMilestone ?? 6);
  const activeIndex = approved ? activeMilestoneIndex(ctx, milestones) : 0;

  return (
    <Workflow name="mission">
      <Sequence>
        <Task
          id="mission:plan"
          output={outputs.missionPlan}
          agent={agents.smartTool}
          timeoutMs={1_800_000}
          heartbeatTimeoutMs={900_000}
          memory={{ remember: { namespace: missionMemory, key: "mission:plan" } }}
        >
          <AskUserInstructions />
          <MissionPlanPrompt
            prompt={ctx.input.prompt}
            maxMilestones={ctx.input.maxMilestones ?? 6}
            maxFeaturesPerMilestone={ctx.input.maxFeaturesPerMilestone ?? 6}
          />
        </Task>

        {plan && approvalRequired && !approval && (
          <Approval
            id="mission:approve-plan"
            output={outputs.missionApproval}
            request={{
              title: "Approve mission plan?",
              summary: plan.summary || "Review the scoped mission plan before workers begin.",
              metadata: { milestones: milestones.length, risks: plan.risks ?? [] },
            }}
            onDeny="continue"
          />
        )}

        {approvalDenied && (
          <Task id="mission:cancelled" output={outputs.missionFinal}>
            {{
              status: "cancelled",
              summary: `Mission plan was not approved. ${approval?.note ?? ""}`.trim(),
              completedMilestones: 0,
              totalMilestones: milestones.length,
              validationPassed: false,
              remainingRisks: plan?.risks ?? [],
              nextActions: ["Revise the mission scope and rerun the workflow."],
              markdownBody: "# Mission Cancelled\n\nThe plan was not approved.",
            }}
          </Task>
        )}

        {plan && approved && activeIndex < milestones.length && renderMilestone(ctx, plan, milestones[activeIndex], activeIndex)}
        {plan && approved && activeIndex >= milestones.length && renderFinal(ctx, plan, milestones)}
      </Sequence>
    </Workflow>
  );
});
