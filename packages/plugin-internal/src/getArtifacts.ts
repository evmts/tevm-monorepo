// @ts-ignore - TODO figure out why these types don't work
import { readJSON } from 'fs-extra/esm'
import { forgeArtifactsValidator } from '.'
import {
  forgeOptionsValidator,
  FoundryOptions,
  getFoundryConfig,
} from './getFoundryConfig'
import { getArtifactPaths } from './getArtifactsPath'
import { getContractName } from './getContractName'

export type Artifacts = Record<string, Awaited<ReturnType<typeof getContract>>>

async function getContract(
  artifactPath: string,
  deployments: Record<string, string>,
) {
  const json = await readJSON(artifactPath)
  const artifact = forgeArtifactsValidator.parse(json)
  return {
    name: getContractName(artifactPath),
    artifactPath,
    ...artifact,
    address: deployments[getContractName(artifactPath)],
  }
}

export const getArtifacts = async (
  options: FoundryOptions,
): Promise<Artifacts> => {
  const contracts: Artifacts = {}

  const parsedOptions = forgeOptionsValidator.parse(options)

  const artifactsPaths = await getArtifactPaths(
    getFoundryConfig(parsedOptions).out,
  )
  for (const artifactsPath of artifactsPaths) {
    const contract = await getContract(artifactsPath, parsedOptions.deployments)
    if (!contract.abi?.length) {
      continue
    }
    const contractName = artifactsPath.split('/').at(-2)
    if (!contractName) {
      throw new Error('contract name not found')
    }
    contracts[contractName] = contract
  }

  return contracts
}
