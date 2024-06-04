const PUBLIC_RPC = 'https://mainnet.optimism.io'
const SEQUENCER_RPC = 'https://mainnet-sequencer.optimism.io'
const EXPLORER = 'https://explorer.optimism.io'

const CHAIN_ID = 10
/**
 * Fixed L2 gas overhead. Used as part of the L2 fee calculation.
 */
const OVERHEAD = 188n
/**
 * Dynamic L2 gas overhead. Used as part of the L2 fee calculation.
 */
const SCALAR = 684000n
/**
 * Identifier for the batcher. For version 1 of this configuration, this is represented as an address left-padded with zeros to 32 bytes.
 */
const BATCHER_HASH = '0x0000000000000000000000006887246668a3b87f54deb3b94ba47a6f63f32985' as const
/**
 * L2 block gas limit as uint64.
 */
const GAS_LIMIT = 30_000_000n
/**
 * High level getter for the unsafe block signer address. Unsafe blocks can be propagated across the p2p network if they are signed by the key corresponding to this address.
 */
const UNSAFE_BLOCK_SIGNER = '0xAAAA45d9549EDA09E70937013520214382Ffc4A2' as const
/**
 *
 */
const BATCH_INBOX = '0xff00000000000000000000000000000011155420' as const
/**
 * Owner of the dispute game factory contract
 */
const DISPUTE_GAME_FACTORY_OWNER = `0x${'0422'.repeat(10)}` as const
/**
 * the configuration for the deposit fee market.
 * Used by the OptimismPortal to meter the cost of buying L2 gas on L1.
 */
const RESOURCE_METERING_RESOURCE_CONFIG = {
	maxResourceLimit: 20000000,
	elasticityMultiplier: 10,
	baseFeeMaxChangeDenominator: 8,
	minimumBaseFee: 1000000000,
	systemTxMaxGas: 1000000,
	maximumBaseFee: 340282366920938463463374607431768211455n,
} as const
const GUARDIAN = '0x9BA6e03D8B90dE867373Db8cF1A58d2F7F006b3A' as const
const SYSTEM_CONFIG_OWNER = '0x9BA6e03D8B90dE867373Db8cF1A58d2F7F006b3A' as const

export const constants = {
	OVERHEAD,
	SCALAR,
	BATCHER_HASH,
	GAS_LIMIT,
	UNSAFE_BLOCK_SIGNER,
	BATCH_INBOX,
	DISPUTE_GAME_FACTORY_OWNER,
	RESOURCE_METERING_RESOURCE_CONFIG,
	GUARDIAN,
	SYSTEM_CONFIG_OWNER,
	CHAIN_ID,
	PUBLIC_RPC,
	SEQUENCER_RPC,
	EXPLORER,
} as const
