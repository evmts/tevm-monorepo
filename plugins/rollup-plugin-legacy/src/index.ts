import {
  Artifacts,
  FoundryOptions,
  buildContracts,
  createModule,
  forgeOptionsValidator,
  getArtifacts,
  getFileName,
  getFoundryConfig,
} from '@evmts/modules-legacy'
// @ts-ignore - TODO figure out why these types don't work
import fs from 'fs-extra/esm'
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

export const foundry = (options: FoundryOptions = {}): Plugin => {
  const foundryOptions = forgeOptionsValidator.parse(options)
  const foundryConfig = getFoundryConfig(foundryOptions)

  let artifacts: Artifacts

  return {
    name: '@evmts/rollup-plugin',
    version: '0.0.0',
    buildStart: async () => {
      await buildContracts(foundryOptions)
      if (!(await fs.pathExists(foundryConfig.out))) {
        throw new Error('artifacts directory does not exist')
      }
      artifacts = await getArtifacts(foundryOptions)
    },
    load(id) {
      if (!id.endsWith('.sol')) {
        return
      }
      const contract = artifacts[getFileName(id)]
      if (!contract) {
        console.log(artifacts, getFileName(id))
        throw new Error(`contract ${id} not found`)
      }
      return createModule(contract)
    },
  }
}

/**
 * @deprecated
 */
export const evmtsPlugin = foundry

/**
 * @deprecated
 */
