/**
 * Native chain types (migrated from viem)
 *
 * These types provide chain configuration compatible with viem's Chain type
 * while being independent of viem.
 *
 * @module chain-types
 */

import type { Address } from './abitype.js'

/**
 * Block explorer configuration for a chain.
 *
 * @example
 * ```typescript
 * const explorer: ChainBlockExplorer = {
 *   name: 'Etherscan',
 *   url: 'https://etherscan.io',
 *   apiUrl: 'https://api.etherscan.io/api',
 * }
 * ```
 */
export type ChainBlockExplorer = {
	/** The name of the block explorer */
	name: string
	/** The URL of the block explorer */
	url: string
	/** The API URL for programmatic access (optional) */
	apiUrl?: string | undefined
}

/**
 * Contract deployment information for a chain.
 *
 * @example
 * ```typescript
 * const multicall: ChainContract = {
 *   address: '0xcA11bde05977b3631167028862bE2a173976CA11',
 *   blockCreated: 14353601,
 * }
 * ```
 */
export type ChainContract = {
	/** The deployed contract address */
	address: Address
	/** The block number at which the contract was deployed (optional) */
	blockCreated?: number | undefined
}

/**
 * Native currency configuration for a chain.
 *
 * @example
 * ```typescript
 * const currency: ChainNativeCurrency = {
 *   name: 'Ether',
 *   symbol: 'ETH',
 *   decimals: 18,
 * }
 * ```
 */
export type ChainNativeCurrency = {
	/** Full name of the currency */
	name: string
	/** 2-6 character symbol of the currency */
	symbol: string
	/** Number of decimal places */
	decimals: number
}

/**
 * RPC URL configuration for a chain.
 *
 * @example
 * ```typescript
 * const rpcUrls: ChainRpcUrls = {
 *   http: ['https://mainnet.infura.io/v3/your-key'],
 *   webSocket: ['wss://mainnet.infura.io/ws/v3/your-key'],
 * }
 * ```
 */
export type ChainRpcUrls = {
	/** HTTP RPC endpoints */
	http: readonly string[]
	/** WebSocket RPC endpoints (optional) */
	webSocket?: readonly string[] | undefined
}

/**
 * Chain formatter type for customizing data formatting.
 *
 * @template TType - The type of data being formatted (block, transaction, etc.)
 */
export type ChainFormatter<TType extends string = string> = {
	/** The format function */
	format: (args: any) => any
	/** The type identifier */
	type: TType
}

/**
 * Chain formatters configuration.
 * Allows customization of how blocks, transactions, and receipts are formatted.
 */
export type ChainFormatters = {
	/** Modifies how the Block structure is formatted & typed */
	block?: ChainFormatter<'block'> | undefined
	/** Modifies how the Transaction structure is formatted & typed */
	transaction?: ChainFormatter<'transaction'> | undefined
	/** Modifies how the TransactionReceipt structure is formatted & typed */
	transactionReceipt?: ChainFormatter<'transactionReceipt'> | undefined
	/** Modifies how the TransactionRequest structure is formatted & typed */
	transactionRequest?: ChainFormatter<'transactionRequest'> | undefined
}

/**
 * Chain serializers configuration.
 * Allows customization of how transactions are serialized.
 */
export type ChainSerializers = {
	/** Modifies how Transactions are serialized */
	transaction?: ((transaction: any, signature?: any) => `0x${string}`) | undefined
}

/**
 * Chain fees configuration.
 * Allows customization of fee estimation for the chain.
 */
export type ChainFees = {
	/**
	 * The fee multiplier to use to account for fee fluctuations.
	 * @default 1.2
	 */
	baseFeeMultiplier?: number | ((args: any) => Promise<number> | number)
	/**
	 * The default maxPriorityFeePerGas to use when a priority fee is not defined.
	 */
	maxPriorityFeePerGas?: bigint | ((args: any) => Promise<bigint | null> | bigint | null) | undefined
	/**
	 * Allows customization of fee per gas values.
	 */
	estimateFeesPerGas?: ((args: any) => Promise<any | null>) | undefined
}

/**
 * Full chain configuration type.
 *
 * This type is compatible with viem's Chain type and can be used interchangeably.
 *
 * @template TFormatters - Custom formatters type
 * @template TCustom - Custom chain data type
 *
 * @example
 * ```typescript
 * const mainnet: Chain = {
 *   id: 1,
 *   name: 'Ethereum',
 *   nativeCurrency: { name: 'Ether', symbol: 'ETH', decimals: 18 },
 *   rpcUrls: {
 *     default: { http: ['https://cloudflare-eth.com'] },
 *   },
 *   blockExplorers: {
 *     default: { name: 'Etherscan', url: 'https://etherscan.io' },
 *   },
 * }
 * ```
 */
export type Chain<
	TFormatters extends ChainFormatters | undefined = ChainFormatters | undefined,
	TCustom extends Record<string, unknown> | undefined = Record<string, unknown> | undefined,
> = {
	/** Collection of block explorers */
	blockExplorers?:
		| {
				[key: string]: ChainBlockExplorer
				default: ChainBlockExplorer
		  }
		| undefined
	/** Block time in milliseconds */
	blockTime?: number | undefined
	/** Collection of contracts deployed on this chain */
	contracts?:
		| ({
				[key: string]: ChainContract | { [sourceId: number]: ChainContract | undefined } | undefined
		  } & {
				ensRegistry?: ChainContract | undefined
				ensUniversalResolver?: ChainContract | undefined
				multicall3?: ChainContract | undefined
				erc6492Verifier?: ChainContract | undefined
		  })
		| undefined
	/** Collection of ENS TLDs for the chain */
	ensTlds?: readonly string[] | undefined
	/** Chain ID in number form */
	id: number
	/** Human-readable name */
	name: string
	/** Currency used by the chain */
	nativeCurrency: ChainNativeCurrency
	/** Preconfirmation time in milliseconds (experimental) */
	experimental_preconfirmationTime?: number | undefined
	/** Collection of RPC endpoints */
	rpcUrls: {
		[key: string]: ChainRpcUrls
		default: ChainRpcUrls
	}
	/** Source Chain ID (ie. the L1 chain for L2s) */
	sourceId?: number | undefined
	/** Flag for test networks */
	testnet?: boolean | undefined
	/** Custom chain data */
	custom?: TCustom | undefined
	/** Modifies how fees are derived */
	fees?: ChainFees | undefined
	/** Modifies how data is formatted and typed */
	formatters?: TFormatters | undefined
	/** Modifies how data is serialized */
	serializers?: ChainSerializers | undefined
}

/**
 * Simplified chain type for basic use cases.
 * Contains only the essential chain properties.
 */
export type SimpleChain = {
	/** Chain ID */
	id: number
	/** Chain name */
	name: string
	/** Native currency */
	nativeCurrency: ChainNativeCurrency
	/** RPC URLs */
	rpcUrls: {
		default: ChainRpcUrls
		[key: string]: ChainRpcUrls
	}
	/** Block explorers (optional) */
	blockExplorers?: {
		default: ChainBlockExplorer
		[key: string]: ChainBlockExplorer
	}
	/** Test network flag (optional) */
	testnet?: boolean
}
