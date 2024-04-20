import { createMemoryClient } from '@tevm/memory-client'
import { constants } from './constants.js'
import {
	createDisputeGameFactory,
	createL1CrossDomainMessenger,
	createL1ERC721Bridge,
	createL1StandardBridge,
	createL2OutputOracle,
	createOptimismMintableERC20Factory,
	createOptimismPortal2,
	createSuperchainConfig,
	createSystemConfig,
} from './contracts/index.js'

/**
 * Creates a Tevm client preloaded and initialized with L1 contracts. This corresponds to the 3.0 major version of Optimism
 * When possible it uses the values from mainnet. For some constants this
 * isn't possible as currently this protocol isn't deployed to a testnet or mainnet.
 *
 * All constants including vital OP stack addresses and owners are available and transactions may be sent mocking them using tevm `to` property.
 */
export const createL1Client = ({ chainId = 10 }: { chainId?: 10 } = {}) => {
	const L1Erc721Bridge = createL1ERC721Bridge(chainId)
	const SuperchainConfig = createSuperchainConfig(chainId)
	const L1CrossDomainMessenger = createL1CrossDomainMessenger(chainId)
	const L1StandardBridge = createL1StandardBridge(chainId)
	const L2OutputOracle = createL2OutputOracle(chainId)
	const OptimismPortal2 = createOptimismPortal2(chainId)
	const DisputeGameFactory = createDisputeGameFactory(chainId)
	const SystemConfig = createSystemConfig(chainId)
	const OptimismMintableERC20Factory = createOptimismMintableERC20Factory(chainId)

	const contracts = {
		L1Erc721Bridge,
		SuperchainConfig,
		L1CrossDomainMessenger,
		L1StandardBridge,
		L2OutputOracle,
		OptimismPortal2,
		DisputeGameFactory,
		SystemConfig,
		OptimismMintableERC20Factory,
	}

	const client = createMemoryClient({
		customPredeploys: [
			{ contract: L1Erc721Bridge, address: L1Erc721Bridge.address },
			{ contract: SuperchainConfig, address: SuperchainConfig.address },
			{ contract: OptimismPortal2, address: OptimismPortal2.address },
			{ contract: DisputeGameFactory, address: DisputeGameFactory.address },
			{ contract: SystemConfig, address: SystemConfig.address },
			{
				contract: L1CrossDomainMessenger,
				address: L1CrossDomainMessenger.address,
			},
			{ contract: L1StandardBridge, address: L1StandardBridge.address },
			{ contract: L2OutputOracle, address: L2OutputOracle.address },
			{ contract: L1Erc721Bridge, address: L1Erc721Bridge.address },
			{
				contract: OptimismMintableERC20Factory,
				address: OptimismMintableERC20Factory.address,
			},
		],
	})
	const asyncPrepare = async () => {
		await client.ready()
		await Promise.all([
			client.contract({
				createTransaction: true,
				...SuperchainConfig.write.initialize(constants.GUARDIAN, false),
			}),
			client.contract({
				createTransaction: true,
				...DisputeGameFactory.write.initialize(constants.DISPUTE_GAME_FACTORY_OWNER),
			}),
			client.contract({
				createTransaction: true,
				...L1StandardBridge.write.initialize(L1CrossDomainMessenger.address, SuperchainConfig.address),
			}),
			client.contract({
				createTransaction: true,
				// this contract is deprecated that is why the constants are not public, client.contract(
				...L2OutputOracle.write.initialize(
					// submission interval
					1800n,
					// l2 block time
					2n,
					// starting block number
					0n,
					// starting timestamp (must be in past)
					0n,
					// proposer
					'0x473300df21D047806A082244b417f96b32f13A33',
					// challenger
					'0x9BA6e03D8B90dE867373Db8cF1A58d2F7F006b3A',
					// finalization period seconds
					604800n,
				),
			}),
			client.contract({
				createTransaction: true,
				...SystemConfig.write.initialize(
					constants.SYSTEM_CONFIG_OWNER,
					constants.OVERHEAD,
					constants.SCALAR,
					constants.BATCHER_HASH,
					constants.GAS_LIMIT,
					constants.UNSAFE_BLOCK_SIGNER,
					constants.RESOURCE_METERING_RESOURCE_CONFIG,
					constants.BATCH_INBOX,
					{
						l1CrossDomainMessenger: L1CrossDomainMessenger.address,
						l1ERC721Bridge: L1Erc721Bridge.address,
						l1StandardBridge: L1StandardBridge.address,
						l2OutputOracle: L2OutputOracle.address,
						optimismMintableERC20Factory: OptimismMintableERC20Factory.address,
						optimismPortal: OptimismPortal2.address,
					},
				),
			}),
			client.contract({
				createTransaction: true,
				...OptimismPortal2.write.initialize(DisputeGameFactory.address, SystemConfig.address, SuperchainConfig.address),
			}),
			client.contract({
				createTransaction: true,
				...OptimismMintableERC20Factory.write.initialize(L1StandardBridge.address),
			}),
			client.contract({
				createTransaction: true,
				...L1CrossDomainMessenger.write.initialize(SuperchainConfig.address, OptimismPortal2.address),
			}),
			client.contract({
				createTransaction: true,
				...L1Erc721Bridge.write.initialize(L1CrossDomainMessenger.address, SuperchainConfig.address),
			}),
		])
	}

	const asyncPreparePromise = asyncPrepare()

	return {
		...client,
		op: { ...contracts, ...constants },
		ready: async () => {
			await asyncPreparePromise
			return client.ready()
		},
	}
}

export type L1Client = ReturnType<typeof createL1Client>
