// this file is adapted from viem
// see it here https://github.com/wevm/viem/blob/main/src/types/eip1193.ts
// Copied from viem commit a098c98231d47ccac9bda1a944880b034020a1b5
// We copy it here for easier developer experience internally and also
// to lock in these types independent of viem potentially making changes
// import type { Address } from 'abitype'
import type { Address, BlockTag, Hex } from '@tevm/utils'
import type { RpcStateOverride } from 'viem'
import type {
	RpcBlock as Block,
	RpcBlockIdentifier as BlockIdentifier,
	RpcBlockNumber as BlockNumber,
	RpcFeeHistory as FeeHistory,
	RpcLog as Log,
	RpcProof as Proof,
	Quantity,
	RpcTransaction as Transaction,
	RpcTransactionReceipt as TransactionReceipt,
	RpcTransactionRequest as TransactionRequest,
	RpcUncle as Uncle,
} from 'viem'
import type { Hash, LogTopic } from './misc.js'

/**
 * [Description of what this type represents]
 * @example
 * ```typescript
 * import { JsonRpcSchemaPublic } from '[package-path]'
 * 
 * const value: JsonRpcSchemaPublic = {
 *   // Initialize properties
 * }
 * ```
 */
export type JsonRpcSchemaPublic = {
	/**
	 * @description Returns the version of the current client
	 *
	 * @example
	 * provider.request({ method: 'web3_clientVersion' })
	 * // => 'MetaMask/v1.0.0'
	 */
	web3_clientVersion: {
		Method: 'web3_clientVersion'
		Parameters?: undefined
		ReturnType: string
	}
	/**
	 * @description Hashes data using the Keccak-256 algorithm
	 *
	 * @example
	 * provider.request({ method: 'web3_sha3', params: ['0x68656c6c6f20776f726c64'] })
	 * // => '0xc94770007dda54cF92009BFF0dE90c06F603a09f'
	 */
	web3_sha3: {
		Method: 'web3_sha3'
		Parameters: [data: Hash]
		ReturnType: string
	}
	/**
	 * @description Determines if this client is listening for new network connections
	 *
	 * @example
	 * provider.request({ method: 'net_listening' })
	 * // => true
	 */
	net_listening: {
		Method: 'net_listening'
		Parameters?: undefined
		ReturnType: boolean
	}
	/**
	 * @description Returns the number of peers currently connected to this client
	 *
	 * @example
	 * provider.request({ method: 'net_peerCount' })
	 * // => '0x1'
	 */
	net_peerCount: {
		Method: 'net_peerCount'
		Parameters?: undefined
		ReturnType: Quantity
	}
	/**
	 * @description Returns the chain ID associated with the current network
	 *
	 * @example
	 * provider.request({ method: 'net_version' })
	 * // => '1'
	 */
	net_version: {
		Method: 'net_version'
		Parameters?: undefined
		ReturnType: Quantity
	}
	/**
	 * @description Returns the current blob price of gas expressed in wei
	 *
	 * @example
	 * provider.request({ method: 'eth_blobGasPrice' })
	 * // => '0x09184e72a000'
	 */
	eth_blobGasPrice: {
		Method: 'eth_blobGasPrice'
		Parameters?: undefined
		ReturnType: Quantity
	}
	/**
	 * @description Returns the number of the most recent block seen by this client
	 *
	 * @example
	 * provider.request({ method: 'eth_blockNumber' })
	 * // => '0x1b4'
	 */
	eth_blockNumber: {
		Method: 'eth_blockNumber'
		Parameters?: undefined
		ReturnType: Quantity
	}
	/**
	 * @description Executes a new message call immediately without submitting a transaction to the network
	 *
	 * @example
	 * provider.request({ method: 'eth_call', params: [{ to: '0x...', data: '0x...' }] })
	 * // => '0x...'
	 */
	eth_call: {
		Method: 'eth_call'
		Parameters:
			| [transaction: Partial<TransactionRequest>]
			| [transaction: Partial<TransactionRequest>, block: BlockNumber | BlockTag | BlockIdentifier]
			| [
					transaction: Partial<TransactionRequest>,
					block: BlockNumber | BlockTag | BlockIdentifier,
					stateOverrideSet: RpcStateOverride,
			  ]
		ReturnType: Hex
	}
	/**
	 * @description Returns the chain ID associated with the current network
	 * @example
	 * provider.request({ method: 'eth_chainId' })
	 * // => '1'
	 */
	eth_chainId: {
		Method: 'eth_chainId'
		Parameters?: undefined
		ReturnType: Quantity
	}
	/**
	 * @description Returns the client coinbase address.
	 * @example
	 * provider.request({ method: 'eth_coinbase' })
	 * // => '0x...'
	 */
	eth_coinbase: {
		Method: 'eth_coinbase'
		Parameters?: undefined
		ReturnType: Address
	}
	/**
	 * @description Estimates the gas necessary to complete a transaction without submitting it to the network
	 *
	 * @example
	 * provider.request({
	 *  method: 'eth_estimateGas',
	 *  params: [{ from: '0x...', to: '0x...', value: '0x...' }]
	 * })
	 * // => '0x5208'
	 */
	eth_estimateGas: {
		Method: 'eth_estimateGas'
		Parameters: [transaction: TransactionRequest] | [transaction: TransactionRequest, block: BlockNumber | BlockTag]
		ReturnType: Quantity
	}
	/**
	 * @description Returns a collection of historical gas information
	 *
	 * @example
	 * provider.request({
	 *  method: 'eth_feeHistory',
	 *  params: ['4', 'latest', ['25', '75']]
	 * })
	 * // => {
	 * //   oldestBlock: '0x1',
	 * //   baseFeePerGas: ['0x1', '0x2', '0x3', '0x4'],
	 * //   gasUsedRatio: ['0x1', '0x2', '0x3', '0x4'],
	 * //   reward: [['0x1', '0x2'], ['0x3', '0x4'], ['0x5', '0x6'], ['0x7', '0x8']]
	 * // }
	 * */
	eth_feeHistory: {
		Method: 'eth_feeHistory'
		Parameters: [
			/** Number of blocks in the requested range. Between 1 and 1024 blocks can be requested in a single query. Less than requested may be returned if not all blocks are available. */
			blockCount: Quantity,
			/** Highest number block of the requested range. */
			newestBlock: BlockNumber | BlockTag,
			/** A monotonically increasing list of percentile values to sample from each block's effective priority fees per gas in ascending order, weighted by gas used. */
			rewardPercentiles: number[] | undefined,
		]
		ReturnType: FeeHistory
	}
	/**
	 * @description Returns the current price of gas expressed in wei
	 *
	 * @example
	 * provider.request({ method: 'eth_gasPrice' })
	 * // => '0x09184e72a000'
	 */
	eth_gasPrice: {
		Method: 'eth_gasPrice'
		Parameters?: undefined
		ReturnType: Quantity
	}
	/**
	 * @description Returns the balance of an address in wei
	 *
	 * @example
	 * provider.request({ method: 'eth_getBalance', params: ['0x...', 'latest'] })
	 * // => '0x12a05...'
	 */
	eth_getBalance: {
		Method: 'eth_getBalance'
		Parameters: [address: Address, block: BlockNumber | BlockTag | BlockIdentifier]
		ReturnType: Quantity
	}
	/**
	 * @description Returns information about a block specified by hash
	 * @link https://eips.ethereum.org/EIPS/eip-1474
	 * @example
	 * provider.request({ method: 'eth_getBlockByHash', params: ['0x...', true] })
	 * // => {
	 * //   number: '0x1b4',
	 * //   hash: '0x...',
	 * //   parentHash: '0x...',
	 * //   ...
	 * // }
	 */
	eth_getBlockByHash: {
		Method: 'eth_getBlockByHash'
		Parameters: [
			/** hash of a block */
			hash: Hash,
			/** true will pull full transaction objects, false will pull transaction hashes */
			includeTransactionObjects: boolean,
		]
		ReturnType: Block | null
	}
	/**
	 * @description Returns information about a block specified by number
	 * @link https://eips.ethereum.org/EIPS/eip-1474
	 * @example
	 * provider.request({ method: 'eth_getBlockByNumber', params: ['0x1b4', true] })
	 * // => {
	 * //   number: '0x1b4',
	 * //   hash: '0x...',
	 * //   parentHash: '0x...',
	 * //   ...
	 * // }
	 */
	eth_getBlockByNumber: {
		Method: 'eth_getBlockByNumber'
		Parameters: [
			/** block number, or one of "latest", "safe", "finalized", "earliest" or "pending" */
			block: BlockNumber | BlockTag,
			/** true will pull full transaction objects, false will pull transaction hashes */
			includeTransactionObjects: boolean,
		]
		ReturnType: Block | null
	}
	/**
	 * @description Returns the number of transactions in a block specified by block hash
	 * @link https://eips.ethereum.org/EIPS/eip-1474
	 * @example
	 * provider.request({ method: 'eth_getBlockTransactionCountByHash', params: ['0x...'] })
	 * // => '0x1'
	 */
	eth_getBlockTransactionCountByHash: {
		Method: 'eth_getBlockTransactionCountByHash'
		Parameters: [hash: Hash]
		ReturnType: Quantity
	}
	/**
	 * @description Returns the number of transactions in a block specified by block number
	 * @link https://eips.ethereum.org/EIPS/eip-1474
	 * @example
	 * provider.request({ method: 'eth_getBlockTransactionCountByNumber', params: ['0x1b4'] })
	 * // => '0x1'
	 */
	eth_getBlockTransactionCountByNumber: {
		Method: 'eth_getBlockTransactionCountByNumber'
		Parameters: [block: BlockNumber | BlockTag]
		ReturnType: Quantity
	}
	/**
	 * @description Returns the contract code stored at a given address
	 * @link https://eips.ethereum.org/EIPS/eip-1474
	 * @example
	 * provider.request({ method: 'eth_getCode', params: ['0x...', 'latest'] })
	 * // => '0x...'
	 */
	eth_getCode: {
		Method: 'eth_getCode'
		Parameters: [address: Address, block: BlockNumber | BlockTag | BlockIdentifier]
		ReturnType: Hex
	}
	/**
	 * @description Returns a list of all logs based on filter ID since the last log retrieval
	 * @link https://eips.ethereum.org/EIPS/eip-1474
	 * @example
	 * provider.request({ method: 'eth_getFilterChanges', params: ['0x...'] })
	 * // => [{ ... }, { ... }]
	 */
	eth_getFilterChanges: {
		Method: 'eth_getFilterChanges'
		Parameters: [filterId: Quantity]
		ReturnType: Log[] | Hex[]
	}
	/**
	 * @description Returns a list of all logs based on filter ID
	 * @link https://eips.ethereum.org/EIPS/eip-1474
	 * @example
	 * provider.request({ method: 'eth_getFilterLogs', params: ['0x...'] })
	 * // => [{ ... }, { ... }]
	 */
	eth_getFilterLogs: {
		Method: 'eth_getFilterLogs'
		Parameters: [filterId: Quantity]
		ReturnType: Log[]
	}
	/**
	 * @description Returns a list of all logs based on a filter object
	 * @link https://eips.ethereum.org/EIPS/eip-1474
	 * @example
	 * provider.request({ method: 'eth_getLogs', params: [{ fromBlock: '0x...', toBlock: '0x...', address: '0x...', topics: ['0x...'] }] })
	 * // => [{ ... }, { ... }]
	 */
	eth_getLogs: {
		Method: 'eth_getLogs'
		Parameters: [
			{
				address?: Address | Address[]
				topics?: LogTopic[]
			} & (
				| {
						fromBlock?: BlockNumber | BlockTag
						toBlock?: BlockNumber | BlockTag
						blockHash?: never
				  }
				| {
						fromBlock?: never
						toBlock?: never
						blockHash?: Hash
				  }
			),
		]
		ReturnType: Log[]
	}
	/**
	 * @description Returns the account and storage values of the specified account including the Merkle-proof.
	 * @link https://eips.ethereum.org/EIPS/eip-1186
	 * @example
	 * provider.request({ method: 'eth_getProof', params: ['0x...', ['0x...'], 'latest'] })
	 * // => {
	 * //   ...
	 * // }
	 */
	eth_getProof: {
		Method: 'eth_getProof'
		Parameters: [
			/** Address of the account. */
			address: Address,
			/** An array of storage-keys that should be proofed and included. */
			storageKeys: Hash[],
			block: BlockNumber | BlockTag,
		]
		ReturnType: Proof
	}
	/**
	 * @description Returns the value from a storage position at an address
	 * @link https://eips.ethereum.org/EIPS/eip-1474
	 * @example
	 * provider.request({ method: 'eth_getStorageAt', params: ['0x...', '0x...', 'latest'] })
	 * // => '0x...'
	 */
	eth_getStorageAt: {
		Method: 'eth_getStorageAt'
		Parameters: [address: Address, index: Quantity, block: BlockNumber | BlockTag | BlockIdentifier]
		ReturnType: Hex
	}
	/**
	 * @description Returns information about a transaction specified by block hash and transaction index
	 * @link https://eips.ethereum.org/EIPS/eip-1474
	 * @example
	 * provider.request({ method: 'eth_getTransactionByBlockHashAndIndex', params: ['0x...', '0x...'] })
	 * // => { ... }
	 */
	eth_getTransactionByBlockHashAndIndex: {
		Method: 'eth_getTransactionByBlockHashAndIndex'
		Parameters: [hash: Hash, index: Quantity]
		ReturnType: Transaction | null
	}
	/**
	 * @description Returns information about a transaction specified by block number and transaction index
	 * @link https://eips.ethereum.org/EIPS/eip-1474
	 * @example
	 * provider.request({ method: 'eth_getTransactionByBlockNumberAndIndex', params: ['0x...', '0x...'] })
	 * // => { ... }
	 */
	eth_getTransactionByBlockNumberAndIndex: {
		Method: 'eth_getTransactionByBlockNumberAndIndex'
		Parameters: [block: BlockNumber | BlockTag, index: Quantity]
		ReturnType: Transaction | null
	}
	/**
	 * @description Returns information about a transaction specified by hash
	 * @link https://eips.ethereum.org/EIPS/eip-1474
	 * @example
	 * provider.request({ method: 'eth_getTransactionByHash', params: ['0x...'] })
	 * // => { ... }
	 */
	eth_getTransactionByHash: {
		Method: 'eth_getTransactionByHash'
		Parameters: [hash: Hash]
		ReturnType: Transaction | null
	}
	/**
	 * @description Returns the number of transactions sent from an address
	 * @link https://eips.ethereum.org/EIPS/eip-1474
	 * @example
	 * provider.request({ method: 'eth_getTransactionCount', params: ['0x...', 'latest'] })
	 * // => '0x1'
	 */
	eth_getTransactionCount: {
		Method: 'eth_getTransactionCount'
		Parameters: [address: Address, block: BlockNumber | BlockTag | BlockIdentifier]
		ReturnType: Quantity
	}
	/**
	 * @description Returns the receipt of a transaction specified by hash
	 * @link https://eips.ethereum.org/EIPS/eip-1474
	 * @example
	 * provider.request({ method: 'eth_getTransactionReceipt', params: ['0x...'] })
	 * // => { ... }
	 */
	eth_getTransactionReceipt: {
		Method: 'eth_getTransactionReceipt'
		Parameters: [hash: Hash]
		ReturnType: TransactionReceipt | null
	}
	/**
	 * @description Returns information about an uncle specified by block hash and uncle index position
	 * @link https://eips.ethereum.org/EIPS/eip-1474
	 * @example
	 * provider.request({ method: 'eth_getUncleByBlockHashAndIndex', params: ['0x...', '0x...'] })
	 * // => { ... }
	 */
	eth_getUncleByBlockHashAndIndex: {
		Method: 'eth_getUncleByBlockHashAndIndex'
		Parameters: [hash: Hash, index: Quantity]
		ReturnType: Uncle | null
	}
	/**
	 * @description Returns information about an uncle specified by block number and uncle index position
	 * @link https://eips.ethereum.org/EIPS/eip-1474
	 * @example
	 * provider.request({ method: 'eth_getUncleByBlockNumberAndIndex', params: ['0x...', '0x...'] })
	 * // => { ... }
	 */
	eth_getUncleByBlockNumberAndIndex: {
		Method: 'eth_getUncleByBlockNumberAndIndex'
		Parameters: [block: BlockNumber | BlockTag, index: Quantity]
		ReturnType: Uncle | null
	}
	/**
	 * @description Returns the number of uncles in a block specified by block hash
	 * @link https://eips.ethereum.org/EIPS/eip-1474
	 * @example
	 * provider.request({ method: 'eth_getUncleCountByBlockHash', params: ['0x...'] })
	 * // => '0x1'
	 */
	eth_getUncleCountByBlockHash: {
		Method: 'eth_getUncleCountByBlockHash'
		Parameters: [hash: Hash]
		ReturnType: Quantity
	}
	/**
	 * @description Returns the number of uncles in a block specified by block number
	 * @link https://eips.ethereum.org/EIPS/eip-1474
	 * @example
	 * provider.request({ method: 'eth_getUncleCountByBlockNumber', params: ['0x...'] })
	 * // => '0x1'
	 */
	eth_getUncleCountByBlockNumber: {
		Method: 'eth_getUncleCountByBlockNumber'
		Parameters: [block: BlockNumber | BlockTag]
		ReturnType: Quantity
	}
	/**
	 * @description Returns the current maxPriorityFeePerGas in wei.
	 * @link https://ethereum.github.io/execution-apis/api-documentation/
	 * @example
	 * provider.request({ method: 'eth_maxPriorityFeePerGas' })
	 * // => '0x5f5e100'
	 */
	eth_maxPriorityFeePerGas: {
		Method: 'eth_maxPriorityFeePerGas'
		Parameters?: undefined
		ReturnType: Quantity
	}
	/**
	 * @description Creates a filter to listen for new blocks that can be used with `eth_getFilterChanges`
	 * @link https://eips.ethereum.org/EIPS/eip-1474
	 * @example
	 * provider.request({ method: 'eth_newBlockFilter' })
	 * // => '0x1'
	 */
	eth_newBlockFilter: {
		Method: 'eth_newBlockFilter'
		Parameters?: undefined
		ReturnType: Quantity
	}
	/**
	 * @description Creates a filter to listen for specific state changes that can then be used with `eth_getFilterChanges`
	 * @link https://eips.ethereum.org/EIPS/eip-1474
	 * @example
	 * provider.request({ method: 'eth_newFilter', params: [{ fromBlock: '0x...', toBlock: '0x...', address: '0x...', topics: ['0x...'] }] })
	 * // => '0x1'
	 */
	eth_newFilter: {
		Method: 'eth_newFilter'
		Parameters: [
			filter: {
				fromBlock?: BlockNumber | BlockTag
				toBlock?: BlockNumber | BlockTag
				address?: Address | Address[]
				topics?: LogTopic[]
			},
		]
		ReturnType: Quantity
	}
	/**
	 * @description Creates a filter to listen for new pending transactions that can be used with `eth_getFilterChanges`
	 * @link https://eips.ethereum.org/EIPS/eip-1474
	 * @example
	 * provider.request({ method: 'eth_newPendingTransactionFilter' })
	 * // => '0x1'
	 */
	eth_newPendingTransactionFilter: {
		Method: 'eth_newPendingTransactionFilter'
		Parameters?: undefined
		ReturnType: Quantity
	}
	/**
	 * @description Returns the current Ethereum protocol version
	 * @link https://eips.ethereum.org/EIPS/eip-1474
	 * @example
	 * provider.request({ method: 'eth_protocolVersion' })
	 * // => '54'
	 */
	eth_protocolVersion: {
		Method: 'eth_protocolVersion'
		Parameters?: undefined
		ReturnType: string
	}
	/**
	 * @description Sends a **signed** transaction to the network
	 * @link https://eips.ethereum.org/EIPS/eip-1474
	 * @example
	 * provider.request({ method: 'eth_sendRawTransaction', params: ['0x...'] })
	 * // => '0x...'
	 */
	eth_sendRawTransaction: {
		Method: 'eth_sendRawTransaction'
		Parameters: [signedTransaction: Hex]
		ReturnType: Hash
	}
	/**
	 * @description Destroys a filter based on filter ID
	 * @link https://eips.ethereum.org/EIPS/eip-1474
	 * @example
	 * provider.request({ method: 'eth_uninstallFilter', params: ['0x1'] })
	 * // => true
	 */
	eth_uninstallFilter: {
		Method: 'eth_uninstallFilter'
		Parameters: [filterId: Quantity]
		ReturnType: boolean
	}
}
