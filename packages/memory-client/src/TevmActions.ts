import type { TevmActionsApi } from '@tevm/decorators'

/**
 * Provides powerful actions for interacting with the EVM using the TEVM API.
 * These actions allow for low-level access to the EVM, managing accounts, deploying contracts, and more.
 *
 * @see [Actions Guide](https://tevm.sh/learn/actions/)
 * @see [Viem Actions API](https://viem.sh/docs/actions/introduction)
 */
export type TevmActions = {
	/**
	 * Returns a promise that resolves when the TEVM is ready.
	 * This is not needed to explicitly be called as all actions will wait for the TEVM to be ready.
	 * @example
	 * ```typescript
	 * import { createMemoryClient } from 'tevm'
	 *
	 * const client = createMemoryClient()
	 *
	 * await client.tevmReady()
	 * ```
	 * Same as calling `client.transport.tevm.ready()`
	 */
	tevmReady: () => Promise<true>

	/**
	 * A powerful low level API for executing calls and sending transactions.
	 * See [CallParams](https://tevm.sh/reference/tevm/actions/type-aliases/callparams/) for options reference.
	 * See [CallResult](https://tevm.sh/reference/tevm/actions/type-aliases/callresult/) for return values reference.
	 * Remember, you must set `createTransaction: true` to send a transaction. Otherwise, it will be a call. You must also mine the transaction
	 * before it updates the canonical head state. This can be avoided by setting mining mode to `auto` when using createMemoryClient.
	 * @example
	 * ```typescript
	 * import { createMemoryClient } from 'tevm'
	 * import { ERC20 } from 'tevm/contract'
	 *
	 * const client = createMemoryClient()
	 *
	 * const token = ERC20.withAddress(`0x${'0721'.repeat(10)}`)
	 *
	 * await client.setAccount(token)
	 *
	 * const balance = await client.tevmCall({
	 *   to: token.address,
	 *   data: encodeFunctionData(token.read.balanceOf, [token.address]),
	 * })
	 * ```
	 * In addition to making basic calls, you can also do advanced things like:
	 * - Impersonate accounts via passing in `from`, `caller`, or `origin`
	 * - Set the call depth via `depth`
	 * - Create a trace or access list using `createTrace: true` or `createAccessList: true`
	 * - Send as a transaction with `createTransaction: true`
	 * For all options see [CallParams](https://tevm.sh/reference/tevm/actions/type-aliases/callparams/)
	 */
	tevmCall: TevmActionsApi['call']

	/**
	 * A powerful low level API for calling contracts. Similar to `tevmCall` but takes care of encoding and decoding data, revert messages, etc.
	 * See [ContractParams](https://tevm.sh/reference/tevm/actions/type-aliases/contractparams/) for options reference.
	 * See [ContractResult](https://tevm.sh/reference/tevm/actions/type-aliases/contractresult/) for return values reference.
	 * Remember, you must set `createTransaction: true` to send a transaction. Otherwise, it will be a call. You must also mine the transaction
	 * before it updates the canonical head state. This can be avoided by setting mining mode to `auto` when using createMemoryClient.
	 * @example
	 * ```typescript
	 * import { createMemoryClient } from 'tevm'
	 * import { ERC20 } from './MyERC721.sol'
	 *
	 * const client = createMemoryClient()
	 * const token = ERC20.withAddress(`0x${'0721'.repeat(10)}`)
	 * await client.setAccount(token)
	 * const balance = await client.tevmContract({
	 *   contract: token,
	 *   method: token.read.balanceOf,
	 *   args: [token.address],
	 * })
	 * ```
	 * In addition to making basic calls, you can also do advanced things like:
	 * - Impersonate accounts via passing in `from`, `caller`, or `origin`
	 * - Set the call depth via `depth`
	 * - Create a trace or access list using `createTrace: true` or `createAccessList: true`
	 * - Send as a transaction with `createTransaction: true`
	 * For all options see [ContractParams](https://tevm.sh/reference/tevm/actions/type-aliases/contractparams/)
	 */
	tevmContract: TevmActionsApi['contract']

	/**
	 * Deploys a contract to the EVM with encoded constructor arguments. Extends `tevmCall` so it supports all advanced options.
	 * @see [DeployParams](https://tevm.sh/reference/tevm/actions/type-aliases/deployparams/) for options reference.
	 * @see [DeployResult](https://tevm.sh/reference/tevm/actions/type-aliases/deployresult/) for return values reference.
	 * Remember, you must set `createTransaction: true` to send a transaction. Otherwise, it will be a call. You must also mine the transaction
	 * before it updates the canonical head state. This can be avoided by setting mining mode to `auto` when using createMemoryClient.
	 * @example
	 * ```typescript
	 * import { createMemoryClient } from 'tevm'
	 * import { ERC20 } from './MyERC721.sol'
	 *
	 * const client = createMemoryClient()
	 * const token = ERC20.withAddress(`0x${'0721'.repeat(10)}`)
	 *
	 * const deploymentResult = await client.tevmDeploy({
	 *   abi: token.abi,
	 *   bytecode: token.bytecode,
	 *   args: ['TokenName', 18, 'SYMBOL'],
	 * })
	 *
	 * console.log(deploymentResult.createdAddress)
	 * ```
	 */
	tevmDeploy: TevmActionsApi['deploy']

	/**
	 * Mines a new block with all pending transactions. In `manual` mode you must call this manually before the canonical head state is updated.
	 * @example
	 * ```typescript
	 * import { createMemoryClient } from 'tevm'
	 *
	 * const client = createMemoryClient()
	 *
	 * await client.tevmMine()
	 * ```
	 */
	tevmMine: TevmActionsApi['mine']

	/**
	 * Loads a JSON serializable state into the EVM. This can be useful for persisting and restoring state between processes.
	 * @example
	 * ```typescript
	 * import { createMemoryClient } from 'tevm'
	 * import fs from 'fs'
	 *
	 * const client = createMemoryClient()
	 *
	 * const state = fs.readFileSync('state.json', 'utf8')
	 *
	 * await client.tevmLoadState(state)
	 * ```
	 */
	tevmLoadState: TevmActionsApi['loadState']

	/**
	 * Dumps a JSON serializable state from the EVM. This can be useful for persisting and restoring state between processes.
	 * @example
	 * ```typescript
	 * import { createMemoryClient } from 'tevm'
	 * import fs from 'fs'
	 * const client = createMemoryClient()
	 * const state = await client.tevmDumpState()
	 * fs.writeFileSync('state.json', JSON.stringify(state))
	 * ```
	 */
	tevmDumpState: TevmActionsApi['dumpState']

	/**
	 * Sets any property of an account including its balance, nonce, contract deployedBytecode, contract state, and more.
	 * @see [SetAccountParams](https://tevm.sh/reference/tevm/actions/type-aliases/setaccountparams/) for options reference.
	 * @see [SetAccountResult](https://tevm.sh/reference/tevm/actions/type-aliases/setaccountresult/) for return values reference.
	 * @example
	 * ```typescript
	 * import { createMemoryClient, numberToHex } from 'tevm'
	 * import { SimpleContract } from 'tevm/contract'
	 *
	 * const client = createMemoryClient()
	 *
	 * await client.tevmSetAccount({
	 *   address: `0x${'0123'.repeat(10)}`,
	 *   balance: 100n,
	 *   nonce: 1n,
	 *   deployedBytecode: SimpleContract.deployedBytecode,
	 *   state: {
	 *     [`0x${'0'.repeat(64)}`]: numberToHex(420n),
	 *   }
	 * })
	 * ```
	 */
	tevmSetAccount: TevmActionsApi['setAccount']

	/**
	 * Gets the account state of an account. It does not return the storage state by default but can if `returnStorage` is set to `true`.
	 * In forked mode, the storage is only the storage TEVM has cached and may not represent all the on-chain storage.
	 * @see [GetAccountParams](https://tevm.sh/reference/tevm/actions/type-aliases/getaccountparams/) for options reference.
	 * @see [GetAccountResult](https://tevm.sh/reference/tevm/actions/type-aliases/getaccountresult/) for return values reference.
	 * @example
	 * ```typescript
	 * import { createMemoryClient } from 'tevm'
	 *
	 * const client = createMemoryClient()
	 *
	 * const account = await client.tevmGetAccount({
	 *   address: `0x${'0000'.repeat(10)}`,
	 *   returnStorage: true,
	 * })
	 * ```
	 */
	tevmGetAccount: TevmActionsApi['getAccount']

	/**
	 * Sets the balance of an account to a specific amount of ETH or ERC20 tokens.
	 * A convenience method over tevmSetAccount for quickly adjusting account balances.
	 * @see [DealParams](https://tevm.sh/reference/tevm/actions/type-aliases/dealparams/) for options reference.
	 * @see [DealResult](https://tevm.sh/reference/tevm/actions/type-aliases/dealresult/) for return values reference.
	 * @example Deal native ETH
	 * ```typescript
	 * import { createMemoryClient } from 'tevm'
	 *
	 * const client = createMemoryClient()
	 *
	 * // Set ETH balance
	 * await client.tevmDeal({
	 *   account: '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266',
	 *   amount: 1000000000000000000n // 1 ETH
	 * })
	 * ```
	 *
	 * @example Deal ERC20 tokens
	 * ```typescript
	 * import { createMemoryClient } from 'tevm'
	 *
	 * const client = createMemoryClient()
	 *
	 * // Set ERC20 token balance
	 * await client.tevmDeal({
	 *   erc20: '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48', // USDC address
	 *   account: '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266',
	 *   amount: 1000000n // 1 USDC (6 decimals)
	 * })
	 * ```
	 */
	tevmDeal: TevmActionsApi['deal']
}
