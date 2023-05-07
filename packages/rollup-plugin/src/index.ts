// @ts-ignore - TODO figure out why these types don't work
import type { Plugin } from 'rollup'
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

type FoundryOptions = {}

export const foundry = (options: FoundryOptions = {}): Plugin => {
  console.log('options', options)
  return {
    name: '@evmts/rollup-plugin',
    version: '0.0.0',
    buildStart: async () => {},
    load(id) {
      if (!id.endsWith('.sol')) {
        return
      }
    },
  }
}

type HardhatOptions = {}

export const hardhat = (options: HardhatOptions = {}): Plugin => {
  console.log('options', options)
  return {
    name: '@evmts/rollup-plugin',
    version: '0.0.0',
    buildStart: async () => {},
    load(id) {
      if (!id.endsWith('.sol')) {
        return
      }
    },
  }
}
