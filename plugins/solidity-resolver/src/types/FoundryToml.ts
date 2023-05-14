import { z } from 'zod'

export const FoundryTomlSchema = z.object({
  out: z.string().optional(),
  artifacts: z.string().optional(),
})

export type FoundryToml = z.infer<typeof FoundryTomlSchema>
