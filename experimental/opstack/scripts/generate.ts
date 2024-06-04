import { writeFile } from 'node:fs/promises'
import { join } from 'node:path'
import { type Address, type Hex, formatAbi } from '@tevm/utils'

// TODO use @eth-optimism/constants for this
const addresses = {
	'10': {
		AddressManager: '0xdE1FCfB0851916CA5101820A69b13a4E276bd81F',
		L1CrossDomainMessenger: '0x25ace71c97B33Cc4729CF772ae268934F7ab5fA1',
		L1ERC721Bridge: '0x5a7749f83b81B301cAb5f48EB8516B986DAef23D',
		L1StandardBridge: '0x99C9fc46f92E8a1c0deC1b1747d010903E884bE1',
		L2OutputOracle: '0xdfe97868233d1aa22e815a266982f2cf17685a27',
		OptimismMintableERC20Factory: '0x75505a97BD334E7BD3C476893285569C4136Fa0F',
		OptimismPortal2: '0xbEb5Fc579115071764c7423A4f12eDde41f106Ed',
		ProxyAdmin: '0x543bA4AADBAb8f9025686Bd03993043599c6fB04',
		SystemConfig: '0x229047fed2591dbec1eF1118d64F7aF3dB9EB290',
		ProxyAdminOwner: '0x5a0Aae59D09fccBdDb6C6CcEB07B7279367C3d2A',
		SystemConfigOwner: '0x9BA6e03D8B90dE867373Db8cF1A58d2F7F006b3A',
		Guardian: '0x9BA6e03D8B90dE867373Db8cF1A58d2F7F006b3A',
		Challenger: '0x9BA6e03D8B90dE867373Db8cF1A58d2F7F006b3A',
	},
} as const

/**
 * These are addresses that are not deployed to mainnet yet and thus have mock contracts
 */
const undeployedAddresses = {
	DelayedVetoable: `0x${'6900'.repeat(10)}`,
	DisputeGameFactory: `0x${'6901'.repeat(10)}`,
	SuperchainConfig: `0x${'6902'.repeat(10)}`,
	ProtocolVersions: `0x${'6903'.repeat(10)}`,
}

/**
 * Predeployed l2 contracts
 */
const l2Predeployed = {
	L2ToL1MessagePasser: '0x4200000000000000000000000000000000000016',
	DeployerWhitelist: '0x4200000000000000000000000000000000000002',
	WETH9: '0x4200000000000000000000000000000000000006',
	L2CrossDomainMessenger: '0x4200000000000000000000000000000000000007',
	L2StandardBridge: '0x4200000000000000000000000000000000000010',
	SequencerFeeVault: '0x4200000000000000000000000000000000000011',
	OptimismMintableERC20Factory: '0x4200000000000000000000000000000000000012',
	L1BlockNumber: '0x4200000000000000000000000000000000000013',
	GasPriceOracle: '0x420000000000000000000000000000000000000F',
	L1Block: '0x4200000000000000000000000000000000000015',
	GovernanceToken: '0x4200000000000000000000000000000000000042',
	LegacyMessagePasser: '0x4200000000000000000000000000000000000000',
	L2ERC721Bridge: '0x4200000000000000000000000000000000000014',
	OptimismMintableERC721Factory: '0x4200000000000000000000000000000000000017',
	ProxyAdmin: '0x4200000000000000000000000000000000000018',
	BaseFeeVault: '0x4200000000000000000000000000000000000019',
	L1FeeVault: '0x420000000000000000000000000000000000001a',
	SchemaRegistry: '0x4200000000000000000000000000000000000020',
	EAS: '0x4200000000000000000000000000000000000021',
	Create2Deployer: '0x13b0D85CcB8bf860b6b79AF3029fCA081AE9beF2',
	MultiCall3: '0xcA11bde05977b3631167028862bE2a173976CA11',
	Safe_v130: '0x69f4D1788e39c87893C980c06EdF4b7f686e2938',
	SafeL2_v130: '0xfb1bffC9d739B8D520DaF37dF666da4C687191EA',
	MultiSendCallOnly_v130: '0xA1dabEF33b3B82c7814B6D82A79e50F4AC44102B',
	SafeSingletonFactory: '0x914d7Fec6aaC8cd542e72Bca78B30650d45643d7',
	DeterministicDeploymentProxy: '0x4e59b44847b379578588920cA78FbF26c0B4956C',
	MultiSend_v130: '0x998739BFdAAdde7C933B942a68053933098f9EDa',
	Permit2: '0x000000000022D473030F116dDEE9F6B43aC78BA3',
	SenderCreator: '0x7fc98430eaedbb6070b35b39d798725049088348',
	EntryPoint: '0x5FF137D4b0FDCD49DcA30c7CF57E578a026d2789',
}
/// Contract names

const l1Contracts = [
	'DelayedVetoable',
	'L1CrossDomainMessenger',
	'L1ERC721Bridge',
	'L1StandardBridge',
	'L2OutputOracle',
	'OptimismPortal2',
	'DisputeGameFactory',
	'ProtocolVersions',
	'SuperchainConfig',
	'SystemConfig',
	'OptimismMintableERC20Factory',
]

const l2Contracts = [
	'BaseFeeVault',
	'GasPriceOracle',
	'L1Block',
	'L1FeeVault',
	'L2CrossDomainMessenger',
	'L2ERC721Bridge',
	'L2StandardBridge',
	'L2ToL1MessagePasser',
	'SequencerFeeVault',
]

/**
 * Loads the artifacts for an optimism contract given a name.
 */
const loadArtifacts = async (contractName: string) => {
	const { abi, bytecode, deployedBytecode } = await import(
		`@eth-optimism/contracts-bedrock/forge-artifacts/${contractName}.sol/${contractName}.json`
	)
	const address: Address =
		addresses['10'][contractName] || undeployedAddresses[contractName] || l2Predeployed[contractName]
	if (!address) {
		throw new Error(`No address found for ${contractName}`)
	}
	return {
		addresses: {
			[10]: address,
		},
		contractName,
		abi,
		bytecode: bytecode.object as Hex,
		deployedBytecode: deployedBytecode.object as Hex,
	}
}

const [l1Artifacts, l2Artifacts] = await Promise.all([
	Promise.all(l1Contracts.map(loadArtifacts)),
	Promise.all(l2Contracts.map(loadArtifacts)),
])

/// Paths

const src = join(__dirname, '..', 'src')
const srcArtifacts = join(src, 'contracts')
const artifactsIndexTsPath = {
	l1: join(src, 'contracts', 'l1', 'index.ts'),
	l2: join(src, 'contracts', 'l2', 'index.ts'),
}

const artifactsIndexTs = {
	l1: '/// Generated file. Do not edit.\n',
	l2: '/// Generated file. Do not edit.\n',
}

/**
 * Mapping of absolute paths to source code
 */
const artifactFiles: Record<string, string> = {}

for (const [layer, artifacts] of [
	['l1', l1Artifacts],
	['l2', l2Artifacts],
] as const) {
	for (const { contractName, abi, bytecode, deployedBytecode, addresses } of artifacts) {
		// export from barrel file
		artifactsIndexTs[layer] += `export * from "./${contractName}.js"\n`

		// create artifact file
		artifactFiles[join(srcArtifacts, layer, `${contractName}.ts`)] = `/// Generated file. Do not edit.

import { createScript } from '@tevm/contract'
import { type Hex } from '@tevm/utils'

/**
 * Creates a ${contractName} contract instance from a chainId
 * Currently only supports chainId 10
 * @example
 * import { create${contractName} } from '@tevm/opstack'
 * const ${contractName} = create${contractName}()
 */
export const create${contractName} = (chainId: 10 = 10) => createScript({
  name: "${contractName}",
  deployedBytecode: ${contractName}DeployedBytecode,
  bytecode: ${contractName}Bytecode,
  humanReadableAbi: ${contractName}HumanReadableAbi,
}).withAddress(${contractName}Addresses[chainId])

export const ${contractName}Addresses = ${JSON.stringify(addresses, null, 2)} as const

export const ${contractName}Bytecode = ${JSON.stringify(bytecode, null, 2)} as Hex

export const ${contractName}DeployedBytecode = ${JSON.stringify(deployedBytecode, null, 2)} as Hex

export const ${contractName}HumanReadableAbi = ${JSON.stringify(formatAbi(abi), null, 2)} as const

export const ${contractName}Abi = ${JSON.stringify(abi, null, 2)} as const
`
	}
}

/// Write files

const promises: Promise<any>[] = []

for (const [path, content] of Object.entries(artifactFiles)) {
	promises.push(writeFile(path, content))
}

for (const [layer, content] of Object.entries(artifactsIndexTs)) {
	const path = artifactsIndexTsPath[layer]
	promises.push(writeFile(path, content))
}

await Promise.all(promises)
