// smithers-source: seeded
/** @jsxImportSource smithers-orchestrator */
import { Task } from "smithers-orchestrator";
import { z } from "zod/v4";

export const commandProbeOutputSchema = z.looseObject({
  command: z.string(),
  available: z.boolean(),
});

export function CommandProbe({ id, command }: { id: string; command: string }) {
  return (
    <Task id={id} output={commandProbeOutputSchema}>
      {{ command, available: true }}
    </Task>
  );
}
