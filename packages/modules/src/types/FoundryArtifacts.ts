import { z } from 'zod'

/**
 * Expected shape of the forge artifacts
 */
export const forgeArtifactsValidator = z.object({
  abi: z.array(
    z.object({
      inputs: z.array(
        z.object({
          internalType: z.string(),
          name: z.string(),
          type: z.string(),
        }),
      ),
      name: z.string(),
      outputs: z
        .array(
          z.object({
            internalType: z.string(),
            name: z.string(),
            type: z.string(),
          }),
        )
        .optional(),
      stateMutability: z.string().optional(),
      type: z.string(),
    }),
  ),
  bytecode: z.object({
    object: z.string(),
    sourceMap: z.string(),
  }),
})

export type ForgeArtifacts = z.infer<typeof forgeArtifactsValidator>
