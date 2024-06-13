import type { BaseParams } from '../common/BaseParams.js'
import type { Address, BlockOverrideSet, BlockParam, Hex, StateOverrideSet } from '../common/index.js'

/**
 * Properties shared across call-like params
 * - [CallParams](https://tevm.sh/reference/tevm/actions/type-aliases/callparams-1/)
 * - [ContractParams](https://tevm.sh/reference/tevm/actions/type-aliases/contractparams-1/)
 * - [DeployParams](https://tevm.sh/reference/tevm/actions/type-aliases/deployparams-1/)
 * - [ScriptParams](https://tevm.sh/reference/tevm/actions/type-aliases/scriptparams-1/)
 * @extends BaseParams
 */
export type BaseCallParams<TThrowOnFail extends boolean = boolean> = BaseParams<TThrowOnFail> & {
	/**
	 * Whether to return a complete trace with the call
	 * Defaults to `false`
	 * @example
	 * ```ts
	 * const {trace} = await tevm.call({address: '0x1234', data: '0x1234', createTrace: true})
	 * trace.structLogs.forEach(console.log)
	 * ```
	 */
	readonly createTrace?: boolean
	/**
	 * Whether to return an access list
	 * Defaults to `false`
	 * @example
	 * ```ts
	 * const {accessList} = await tevm.call({address: '0x1234', data: '0x1234', createAccessList: true})
	 * console.log(accessList) // { "0x...": Set(["0x..."])}
	 * ```
	 */
	readonly createAccessList?: boolean
	/**
	 * Whether or not to update the state or run call in a dry-run. Defaults to `never`
	 * - `on-success`: Only update the state if the call is successful
	 * - `always`: Always include tx even if it reverted
	 * - `never`: Never include tx
	 * - `true`: alias for `on-success`
	 * - `false`: alias for `never`
	 * Always will still not include the transaction if it's not valid to be included in
	 * the chain such as the gas limit being too low.
	 * If set to true and a tx is submitted the `txHash` will be returned in the response.
	 * The tx will not be included in the chain until it is mined though
	 * @example
	 * ```typescript
	 * const {txHash} = await client.call({address: '0x1234', data: '0x1234', createTransaction: 'on-success'})
	 * await client.mine()
	 * const receipt = await client.getTransactionReceipt({hash: txHash})
	 * ```
	 */
	readonly createTransaction?: 'on-success' | 'always' | 'never' | boolean
	/**
	 * The block number or block tag to execute the call at. Defaults to `latest`.
	 * Setting to `pending` will run the tx against a block built with the pending tx in the txpool
	 * that have not yet been mined.
	 */
	readonly blockTag?: BlockParam
	/**
	 * Set caller to msg.value of less than msg.value
	 * Defaults to false exceipt for when running scripts
	 * where it is set to true
	 */
	readonly skipBalance?: boolean
	/**
	 * The gas limit for the call.
	 * Defaults to the block gas limit as specified by common or the fork url
	 */
	readonly gas?: bigint
	/**
	 * The gas price for the call.
	 * Note atm because only EIP-1559 tx transactions are created using the `maxFeePerGas` and `maxPriorityFeePerGas` options
	 * this option will be ignored when creating transactions. This will be fixed in a future release
	 */
	readonly gasPrice?: bigint
	/**
	 * The maximum fee per gas for the EIP-1559 tx. This is the maximum amount of ether that can be spent on gas
	 * for the call. This is the maximum amount of ether that can be spent on gas for the call.
	 * This is the maximum amount of ether that can be spent on gas for the call.
	 */
	readonly maxFeePerGas?: bigint
	/**
	 * The maximum priority fee per gas for the EIP-1559 tx.
	 */
	readonly maxPriorityFeePerGas?: bigint
	/**
	 * Low level control
	 * Refund counter. Defaults to `0`
	 */
	readonly gasRefund?: bigint
	/**
	 * The from address for the call. Defaults to the zero address on reads and account[0] on writes.
	 * It is also possible to set the `origin` and `caller` addresses seperately using
	 * those options. Otherwise both are set to the `from` address
	 */
	readonly from?: Address
	/**
	 * The address where the call originated from. Defaults to the zero address.
	 * This defaults to `from` address if set otherwise it defaults to the zero address
	 */
	readonly origin?: Address
	/**
	 * The address that ran this code (`msg.sender`). Defaults to the zero address.
	 * This defaults to `from` address if set otherwise it defaults to the zero address
	 */
	readonly caller?: Address
	/**
	 * The value in ether that is being sent to `opts.address`. Defaults to `0`
	 */
	readonly value?: bigint
	/**
	 * Low level control over the EVM call depth. Useful if you want to simulate an internal call.
	 * Defaults to `0`
	 */
	readonly depth?: number
	/**
	 * Addresses to selfdestruct. Defaults to the empty set.
	 */
	readonly selfdestruct?: Set<Address>
	/**
	 * The address of the account that is executing this code (`address(this)`). Defaults to the zero address.
	 * To is not set for create transactions but required for most transactions
	 */
	readonly to?: Address
	/**
	 * Versioned hashes for each blob in a blob transaction for 4844 transactions
	 */
	readonly blobVersionedHashes?: Hex[]
	// state override description and api is adapted from geth https://geth.ethereum.org/docs/interacting-with-geth/rpc/ns-eth
	/**
	 * The state override set is an optional address-to-state mapping, where each entry specifies some state to be ephemerally overridden prior to executing the call. Each address maps to an object containing:
	 * This option cannot be used when `createTransaction` is set to `true`
	 *
	 * The goal of the state override set is manyfold:
	 *
	 * It can be used by DApps to reduce the amount of contract code needed to be deployed on chain. Code that simply returns internal state or does pre-defined validations can be kept off chain and fed to the node on-demand.
	 * It can be used for smart contract analysis by extending the code deployed on chain with custom methods and invoking them. This avoids having to download and reconstruct the entire state in a sandbox to run custom code against.
	 * It can be used to debug smart contracts in an already deployed large suite of contracts by selectively overriding some code or state and seeing how execution changes. Specialized tooling will probably be necessary.
	 * @example
	 * ```ts
	 * const stateOverride = {
	 *   "0xd9c9cd5f6779558b6e0ed4e6acf6b1947e7fa1f3": {
	 *     "balance": "0xde0b6b3a7640000"
	 *   },
	 *   "0xebe8efa441b9302a0d7eaecc277c09d20d684540": {
	 *     "code": "0x...",
	 *     "state": {
	 *       "0x...": "0x..."
	 *     }
	 *   }
	 * }
	 * const res = await client.call({address: '0x1234', data: '0x1234', stateOverrideSet: stateOverride})
	 * ```
	 */
	readonly stateOverrideSet?: StateOverrideSet
	/**
	 * The fields of this optional object customize the block as part of which the call is simulated. The object contains the following fields:
	 * This option cannot be used when `createTransaction` is set to `true`
	 * Setting the block number to past block will not run in the context of that blocks state. To do that fork that block number first.
	 * @example
	 * ```ts
	 * const blockOverride = {
	 *  "number": "0x1b4",
	 *  "hash": "0x
	 *  "parentHash": "0x",
	 *  "nonce": "0x0000000000000042",
	 * }
	 * const res = await client.call({address: '0x1234', data: '0x1234', blockOverrideSet: blockOverride})
	 */
	readonly blockOverrideSet?: BlockOverrideSet
}
