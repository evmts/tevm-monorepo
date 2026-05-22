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
	 * Resolves when the TEVM is ready. All other actions await this implicitly. Equivalent to `client.transport.tevm.ready()`.
	 */
	tevmReady: () => Promise<true>

	/**
	 * Low-level call/transaction API. To send a transaction (rather than a call), pass `createTransaction: true`
	 * and mine the result (or use `miningConfig: { type: 'auto' }`). Supports impersonation (`from`/`caller`/`origin`),
	 * `depth`, `createTrace`, `createAccessList`, and more.
	 *
	 * @see [CallParams](https://tevm.sh/reference/tevm/actions/type-aliases/callparams/)
	 * @see [CallResult](https://tevm.sh/reference/tevm/actions/type-aliases/callresult/)
	 */
	tevmCall: TevmActionsApi['call']

	/**
	 * Higher-level contract call: handles ABI encoding/decoding and revert messages. Same options as
	 * `tevmCall` apply (impersonation, tracing, access list, `createTransaction`).
	 *
	 * @see [ContractParams](https://tevm.sh/reference/tevm/actions/type-aliases/contractparams/)
	 * @see [ContractResult](https://tevm.sh/reference/tevm/actions/type-aliases/contractresult/)
	 */
	tevmContract: TevmActionsApi['contract']

	/**
	 * Deploys a contract with encoded constructor arguments. Inherits all `tevmCall` options.
	 *
	 * @see [DeployParams](https://tevm.sh/reference/tevm/actions/type-aliases/deployparams/)
	 * @see [DeployResult](https://tevm.sh/reference/tevm/actions/type-aliases/deployresult/)
	 */
	tevmDeploy: TevmActionsApi['deploy']

	/**
	 * Mines pending transactions into a new block. Required in manual mining mode to advance canonical state.
	 */
	tevmMine: TevmActionsApi['mine']

	/**
	 * Loads a previously dumped state into the EVM.
	 */
	tevmLoadState: TevmActionsApi['loadState']

	/**
	 * Dumps the EVM state as a JSON-serializable object for persistence.
	 */
	tevmDumpState: TevmActionsApi['dumpState']

	/**
	 * Directly sets any property of an account (balance, nonce, deployedBytecode, storage).
	 *
	 * @see [SetAccountParams](https://tevm.sh/reference/tevm/actions/type-aliases/setaccountparams/)
	 * @see [SetAccountResult](https://tevm.sh/reference/tevm/actions/type-aliases/setaccountresult/)
	 */
	tevmSetAccount: TevmActionsApi['setAccount']

	/**
	 * Reads an account's state. Storage is only included if `returnStorage: true`, and in fork mode only
	 * already-cached slots are returned.
	 *
	 * @see [GetAccountParams](https://tevm.sh/reference/tevm/actions/type-aliases/getaccountparams/)
	 * @see [GetAccountResult](https://tevm.sh/reference/tevm/actions/type-aliases/getaccountresult/)
	 */
	tevmGetAccount: TevmActionsApi['getAccount']

	/**
	 * Convenience wrapper over `tevmSetAccount` for setting ETH or ERC20 balances.
	 *
	 * @see [DealParams](https://tevm.sh/reference/tevm/actions/type-aliases/dealparams/)
	 * @see [DealResult](https://tevm.sh/reference/tevm/actions/type-aliases/dealresult/)
	 *
	 * @example
	 * ```typescript
	 * await client.tevmDeal({
	 *   erc20: '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48',
	 *   account: '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266',
	 *   amount: 1000000n,
	 * })
	 * ```
	 */
	tevmDeal: TevmActionsApi['deal']
}
