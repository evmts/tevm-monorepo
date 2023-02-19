import { execa } from 'execa'
// @ts-ignore - TODO figure out why these types don't work
import fs from 'fs-extra/esm'
import { globby } from 'globby'
import { basename, extname } from 'pathe'
import type { Plugin } from 'rollup'
import { z } from 'zod'
import { buildContracts } from './buildContracts'
import { createModule } from './createModule'

import type { FoundryOptions } from './getFoundryConfig'
import { forgeOptionsValidator, getFoundryConfig } from './getFoundryConfig'
import { Artifacts, getArtifacts } from './getArtifacts'
import { getArtifactPaths } from './getArtifactsPath'

function getContractName(artifactPath: string) {
  const filename = basename(artifactPath)
  const extension = extname(artifactPath)
  return filename.replace(extension, '')
}

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

export const evmtsPlugin = (options: FoundryOptions = {}): Plugin => {
  const foundryOptions = forgeOptionsValidator.parse(options)
  const foundryConfig = getFoundryConfig(foundryOptions)

  let artifacts: Artifacts

  return {
    name: '@evmts/plugin-rollup',
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
      const contract = artifacts[getContractName(id)]
      if (!contract) {
        throw new Error(`contract ${id} not found`)
      }
      return createModule(contract)
    },
  }
}
