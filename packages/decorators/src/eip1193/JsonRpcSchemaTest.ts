// this file is adapted from viem
// see it here https://github.com/wevm/viem/blob/main/src/types/eip1193.ts
// Copied from viem commit a098c98231d47ccac9bda1a944880b034020a1b5
// We copy it here for easier developer experience internally and also
// to lock in these types independent of viem potentially making changes
import type { Address, Hex, Quantity, RpcTransaction as Transaction, RpcTransactionRequest as TransactionRequest } from '@tevm/utils'
import type { Hash } from './misc.js'

export type TestRpcSchema<TMode extends string> = [
	/**
	 * @description Add information about compiled contracts
	 * @link https://hardhat.org/hardhat-network/docs/reference#hardhat_addcompilationresult
	 */
	addCompilationResult: {
		Method: `${TMode}_addCompilationResult`
		Parameters: any[]
		ReturnType: any
	},
	/**
	 * @description Remove a transaction from the mempool
	 * @link https://hardhat.org/hardhat-network/docs/reference#hardhat_droptransaction
	 */
	dropTransaction: {
		Method: `${TMode}_dropTransaction`
		Parameters: [hash: Hash]
		ReturnType: void
	},
	/**
	 * @description Serializes the current state (including contracts code, contract's storage, accounts properties, etc.) into a savable data blob.
	 */
	dumpState: {
		Method: `${TMode}_dumpState`
		Parameters?: undefined
		ReturnType: Hex
	},
	/**
	 * @description Turn on call traces for transactions that are returned to the user when they execute a transaction (instead of just txhash/receipt).
	 */
	enableTraces: {
		Method: `${TMode}_enableTraces`
		Parameters?: undefined
		ReturnType: void
	},
	/**
	 * @description Impersonate an account or contract address.
	 * @link https://hardhat.org/hardhat-network/docs/reference#hardhat_impersonateaccount
	 */
	impersonateAccount: {
		Method: `${TMode}_impersonateAccount`
		Parameters: [address: Address]
		ReturnType: void
	},
	/**
	 * @description Returns true if automatic mining is enabled, and false otherwise. See [Mining Modes](https://hardhat.org/hardhat-network/explanation/mining-modes) to learn more.
	 * @link https://hardhat.org/hardhat-network/docs/reference#hardhat_getautomine
	 */
	getAutomine: {
		Method: `${TMode}_getAutomine`
		Parameters?: undefined
		ReturnType: boolean
	},
	/**
	 * @description Adds state previously dumped with `dumpState` to the current chain.
	 */
	loadState: {
		Method: `${TMode}_loadState`
		Parameters?: [Hex]
		ReturnType: void
	},
	/**
	 * @description Advance the block number of the network by a certain number of blocks
	 * @link https://hardhat.org/hardhat-network/docs/reference#hardhat_mine
	 */
	mine: {
		Method: `${TMode}_mine`
		Parameters: [
			/** Number of blocks to mine. */
			count: Hex,
			/** Interval between each block in seconds. */
			interval: Hex | undefined,
		]
		ReturnType: void
	},
	/**
	 * @description Resets the fork.
	 * @link https://hardhat.org/hardhat-network/docs/reference#hardhat_reset
	 */
	reset: {
		Method: `${TMode}_reset`
		Parameters: any[]
		ReturnType: void
	},
	/**
	 * @description Modifies the balance of an account.
	 * @link https://hardhat.org/hardhat-network/docs/reference#hardhat_setbalance
	 */
	setBalance: {
		Method: `${TMode}_setBalance`
		Parameters: [
			/** The address of the target account. */
			address: Address,
			/** Amount to send in wei. */
			balance: Quantity,
		]
		ReturnType: void
	},
	/**
	 * @description Modifies the bytecode stored at an account's address.
	 * @link https://hardhat.org/hardhat-network/docs/reference#hardhat_setcode
	 */
	setCode: {
		Method: `${TMode}_setCode`
		Parameters: [
			/** The address of the contract. */
			address: Address,
			/** Data bytecode. */
			data: string,
		]
		ReturnType: void
	},
	/**
	 * @description Sets the coinbase address to be used in new blocks.
	 * @link https://hardhat.org/hardhat-network/docs/reference#hardhat_setcoinbase
	 */
	setCoinbase: {
		Method: `${TMode}_setCoinbase`
		Parameters: [
			/** The address to set as the coinbase address. */
			address: Address,
		]
		ReturnType: void
	},
	/**
	 * @description Enable or disable logging on the test node network.
	 * @link https://hardhat.org/hardhat-network/docs/reference#hardhat_setcoinbase
	 */
	setLoggingEnabled: {
		Method: `${TMode}_setLoggingEnabled`
		Parameters: [enabled: boolean]
		ReturnType: void
	},
	/**
	 * @description Change the minimum gas price accepted by the network (in wei).
	 * @link https://hardhat.org/hardhat-network/docs/reference#hardhat_setmingasprice
	 */
	setMinGasPrice: {
		Method: `${TMode}_setMinGasPrice`
		Parameters: [gasPrice: Quantity]
		ReturnType: void
	},
	/**
	 * @description Sets the base fee of the next block.
	 * @link https://hardhat.org/hardhat-network/docs/reference#hardhat_setnextblockbasefeepergas
	 */
	setNextBlockBaseFeePerGas: {
		Method: `${TMode}_setNextBlockBaseFeePerGas`
		Parameters: [baseFeePerGas: Quantity]
		ReturnType: void
	},
	/**
	 * @description Modifies an account's nonce by overwriting it.
	 * @link https://hardhat.org/hardhat-network/docs/reference#hardhat_setnonce
	 */
	setNonce: {
		Method: `${TMode}_setNonce`
		Parameters: [
			/** The account address. */
			address: Address,
			/** The new nonce. */
			nonce: Quantity,
		]
		ReturnType: void
	},
	/**
	 * @description Sets the backend RPC URL.
	 */
	setRpcUrl: {
		Method: `${TMode}_setRpcUrl`
		Parameters: [url: string]
		ReturnType: void
	},
	/**
	 * @description Writes a single position of an account's storage.
	 * @link https://hardhat.org/hardhat-network/docs/reference#hardhat_setstorageat
	 */
	setStorageAt: {
		Method: `${TMode}_setStorageAt`
		Parameters: [
			/** The account address. */
			address: Address,
			/** The storage position index. */
			index: Quantity,
			/** The storage value. */
			value: Quantity,
		]
		ReturnType: void
	},
	/**
	 * @description Use this method to stop impersonating an account after having previously used impersonateAccount.
	 * @link https://hardhat.org/hardhat-network/docs/reference#hardhat_stopimpersonatingaccount
	 */
	stopImpersonatingAccount: {
		Method: `${TMode}_stopImpersonatingAccount`
		Parameters: [
			/** The address to stop impersonating. */
			address: Address,
		]
		ReturnType: void
	},
	/**
	 * @description Jump forward in time by the given amount of time, in seconds.
	 * @link https://github.com/trufflesuite/ganache/blob/ef1858d5d6f27e4baeb75cccd57fb3dc77a45ae8/src/chains/ethereum/ethereum/RPC-METHODS.md#evm_increasetime
	 */
	increaseTime: {
		Method: `${TMode}_increaseTime`
		Parameters: [seconds: number]
		ReturnType: Quantity
	},
	/**
	 * @description Modifies the balance of an account.
	 * @link https://ganache.dev/#evm_setAccountBalance
	 */
	setAccountBalance: {
		Method: `evm_setAccountBalance`
		Parameters: [
			/** The address of the target account. */
			address: Address,
			/** Amount to send in wei. */
			value: Quantity,
		]
		ReturnType: void
	},
	/**
	 * @description Enables or disables, based on the single boolean argument, the automatic mining of new blocks with each new transaction submitted to the network.
	 * @link https://hardhat.org/hardhat-network/docs/reference#evm_setautomine
	 */
	evm_setAutomine: {
		Method: `evm_setAutomine`
		Parameters: [boolean]
		ReturnType: void
	},
	/**
	 * @description Sets the block's gas limit.
	 * @link https://hardhat.org/hardhat-network/docs/reference#evm_setblockgaslimit
	 */
	evm_setBlockGasLimit: {
		Method: 'evm_setBlockGasLimit'
		Parameters: [gasLimit: Quantity]
		ReturnType: void
	},
	/**
	 * @description Jump forward in time by the given amount of time, in seconds.
	 * @link https://github.com/trufflesuite/ganache/blob/ef1858d5d6f27e4baeb75cccd57fb3dc77a45ae8/src/chains/ethereum/ethereum/RPC-METHODS.md#evm_increasetime
	 */
	evm_increaseTime: {
		Method: `evm_increaseTime`
		Parameters: [seconds: Quantity]
		ReturnType: Quantity
	},
	/**
	 * @description Similar to `evm_increaseTime` but sets a block timestamp `interval`.
	 * The timestamp of the next block will be computed as `lastBlock_timestamp` + `interval`
	 */
	setBlockTimestampInterval: {
		Method: `${TMode}_setBlockTimestampInterval`
		Parameters: [seconds: number]
		ReturnType: void
	},
	/**
	 * @description Removes `setBlockTimestampInterval` if it exists
	 */
	removeBlockTimestampInterval: {
		Method: `${TMode}_removeBlockTimestampInterval`
		Parameters?: undefined
		ReturnType: void
	},
	/**
	 * @description Enables (with a numeric argument greater than 0) or disables (with a numeric argument equal to 0), the automatic mining of blocks at a regular interval of milliseconds, each of which will include all pending transactions.
	 * @link https://hardhat.org/hardhat-network/docs/reference#evm_setintervalmining
	 */
	evm_setIntervalMining: {
		Method: 'evm_setIntervalMining'
		Parameters: [number]
		ReturnType: void
	},
	/**
	 * @description Set the timestamp of the next block.
	 * @link https://hardhat.org/hardhat-network/docs/reference#evm_setnextblocktimestamp
	 */
	evm_setNextBlockTimestamp: {
		Method: 'evm_setNextBlockTimestamp'
		Parameters: [Quantity]
		ReturnType: void
	},
	/**
	 * @description Snapshot the state of the blockchain at the current block. Takes no parameters. Returns the id of the snapshot that was created.
	 * @link https://hardhat.org/hardhat-network/docs/reference#evm_snapshot
	 */
	evm_snapshot: {
		Method: 'evm_snapshot'
		Parameters?: undefined
		ReturnType: Quantity
	},
	/**
	 * @description Revert the state of the blockchain to a previous snapshot. Takes a single parameter, which is the snapshot id to revert to.
	 */
	evm_revert: {
		Method: 'evm_revert'
		Parameters?: [id: Quantity]
		ReturnType: void
	},
	/**
	 * @description Enables the automatic mining of new blocks with each new transaction submitted to the network.
	 * @link https://ganache.dev/#miner_start
	 */
	miner_start: {
		Method: 'miner_start'
		Parameters?: undefined
		ReturnType: void
	},
	/**
	 * @description Disables the automatic mining of new blocks with each new transaction submitted to the network.
	 * @link https://ganache.dev/#miner_stop
	 */
	miner_stop: {
		Method: 'miner_stop'
		Parameters?: undefined
		ReturnType: void
	},
	/**
	 * @link https://geth.ethereum.org/docs/interacting-with-geth/rpc/ns-txpool#txpool-content
	 */
	txpool_content: {
		Method: 'txpool_content'
		Parameters?: undefined
		ReturnType: {
			pending: Record<Address, Record<string, Transaction>>
			queued: Record<Address, Record<string, Transaction>>
		}
	},
	/**
	 * @link https://geth.ethereum.org/docs/interacting-with-geth/rpc/ns-txpool#txpool-inspect
	 */
	txpool_inspect: {
		Method: 'txpool_inspect'
		Parameters?: undefined
		ReturnType: {
			pending: Record<Address, Record<string, string>>
			queued: Record<Address, Record<string, string>>
		}
	},
	/**
	 * @link https://geth.ethereum.org/docs/interacting-with-geth/rpc/ns-txpool#txpool-inspect
	 */
	txpool_status: {
		Method: 'txpool_status'
		Parameters?: undefined
		ReturnType: {
			pending: Quantity
			queued: Quantity
		}
	},
	/**
	 * @description Returns whether the client is actively mining new blocks.
	 * @link https://eips.ethereum.org/EIPS/eip-1474
	 * @example
	 * provider.request({ method: 'eth_mining' })
	 * // => true
	 */
	eth_mining: {
		Method: 'eth_mining'
		Parameters?: undefined
		ReturnType: boolean
	},
	/**
	 * @description Advance the block number of the network by a certain number of blocks.
	 * @link https://ganache.dev/#evm_mine
	 */
	evm_mine: {
		Method: 'evm_mine'
		Parameters?: [
			{
				/** Number of blocks to mine. */
				blocks: Hex
			},
		]
		ReturnType: void
	},
	/**
	 * @description Creates, signs, and sends a new transaction to the network regardless of the signature.
	 * @link https://eips.ethereum.org/EIPS/eip-1474
	 * @example
	 * provider.request({ method: 'eth_sendTransaction', params: [{ from: '0x...', to: '0x...', value: '0x...' }] })
	 * // => '0x...'
	 */
	eth_sendUnsignedTransaction: {
		Method: 'eth_sendUnsignedTransaction'
		Parameters: [transaction: TransactionRequest]
		ReturnType: Hash
	},
]
