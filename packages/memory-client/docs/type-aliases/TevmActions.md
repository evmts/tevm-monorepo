[**@tevm/memory-client**](../README.md)

***

[@tevm/memory-client](../globals.md) / TevmActions

# Type Alias: TevmActions

> **TevmActions** = `object`

Defined in: [packages/memory-client/src/TevmActions.ts:10](https://github.com/evmts/tevm-monorepo/blob/main/packages/memory-client/src/TevmActions.ts#L10)

Provides powerful actions for interacting with the EVM using the TEVM API.
These actions allow for low-level access to the EVM, managing accounts, deploying contracts, and more.

## See

 - [Actions Guide](https://tevm.sh/learn/actions/)
 - [Viem Actions API](https://viem.sh/docs/actions/introduction)

## Properties

| Property | Type | Description | Defined in |
| ------ | ------ | ------ | ------ |
| <a id="tevmcall"></a> `tevmCall` | `TevmActionsApi`\[`"call"`\] | Low-level call/transaction API. To send a transaction (rather than a call), pass `createTransaction: true` and mine the result (or use `miningConfig: { type: 'auto' }`). Supports impersonation (`from`/`caller`/`origin`), `depth`, `createTrace`, `createAccessList`, and more. **See** - [CallParams](https://tevm.sh/reference/tevm/actions/type-aliases/callparams/) - [CallResult](https://tevm.sh/reference/tevm/actions/type-aliases/callresult/) | [packages/memory-client/src/TevmActions.ts:24](https://github.com/evmts/tevm-monorepo/blob/main/packages/memory-client/src/TevmActions.ts#L24) |
| <a id="tevmcontract"></a> `tevmContract` | `TevmActionsApi`\[`"contract"`\] | Higher-level contract call: handles ABI encoding/decoding and revert messages. Same options as `tevmCall` apply (impersonation, tracing, access list, `createTransaction`). **See** - [ContractParams](https://tevm.sh/reference/tevm/actions/type-aliases/contractparams/) - [ContractResult](https://tevm.sh/reference/tevm/actions/type-aliases/contractresult/) | [packages/memory-client/src/TevmActions.ts:33](https://github.com/evmts/tevm-monorepo/blob/main/packages/memory-client/src/TevmActions.ts#L33) |
| <a id="tevmdeal"></a> `tevmDeal` | `TevmActionsApi`\[`"deal"`\] | Convenience wrapper over `tevmSetAccount` for setting ETH or ERC20 balances. **See** - [DealParams](https://tevm.sh/reference/tevm/actions/type-aliases/dealparams/) - [DealResult](https://tevm.sh/reference/tevm/actions/type-aliases/dealresult/) **Example** `await client.tevmDeal({ erc20: '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48', account: '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266', amount: 1000000n, })` | [packages/memory-client/src/TevmActions.ts:90](https://github.com/evmts/tevm-monorepo/blob/main/packages/memory-client/src/TevmActions.ts#L90) |
| <a id="tevmdeploy"></a> `tevmDeploy` | `TevmActionsApi`\[`"deploy"`\] | Deploys a contract with encoded constructor arguments. Inherits all `tevmCall` options. **See** - [DeployParams](https://tevm.sh/reference/tevm/actions/type-aliases/deployparams/) - [DeployResult](https://tevm.sh/reference/tevm/actions/type-aliases/deployresult/) | [packages/memory-client/src/TevmActions.ts:41](https://github.com/evmts/tevm-monorepo/blob/main/packages/memory-client/src/TevmActions.ts#L41) |
| <a id="tevmdumpstate"></a> `tevmDumpState` | `TevmActionsApi`\[`"dumpState"`\] | Dumps the EVM state as a JSON-serializable object for persistence. | [packages/memory-client/src/TevmActions.ts:56](https://github.com/evmts/tevm-monorepo/blob/main/packages/memory-client/src/TevmActions.ts#L56) |
| <a id="tevmgetaccount"></a> `tevmGetAccount` | `TevmActionsApi`\[`"getAccount"`\] | Reads an account's state. Storage is only included if `returnStorage: true`, and in fork mode only already-cached slots are returned. **See** - [GetAccountParams](https://tevm.sh/reference/tevm/actions/type-aliases/getaccountparams/) - [GetAccountResult](https://tevm.sh/reference/tevm/actions/type-aliases/getaccountresult/) | [packages/memory-client/src/TevmActions.ts:73](https://github.com/evmts/tevm-monorepo/blob/main/packages/memory-client/src/TevmActions.ts#L73) |
| <a id="tevmloadstate"></a> `tevmLoadState` | `TevmActionsApi`\[`"loadState"`\] | Loads a previously dumped state into the EVM. | [packages/memory-client/src/TevmActions.ts:51](https://github.com/evmts/tevm-monorepo/blob/main/packages/memory-client/src/TevmActions.ts#L51) |
| <a id="tevmmine"></a> `tevmMine` | `TevmActionsApi`\[`"mine"`\] | Mines pending transactions into a new block. Required in manual mining mode to advance canonical state. | [packages/memory-client/src/TevmActions.ts:46](https://github.com/evmts/tevm-monorepo/blob/main/packages/memory-client/src/TevmActions.ts#L46) |
| <a id="tevmready"></a> `tevmReady` | () => `Promise`\<`true`\> | Resolves when the TEVM is ready. All other actions await this implicitly. Equivalent to `client.transport.tevm.ready()`. | [packages/memory-client/src/TevmActions.ts:14](https://github.com/evmts/tevm-monorepo/blob/main/packages/memory-client/src/TevmActions.ts#L14) |
| <a id="tevmsetaccount"></a> `tevmSetAccount` | `TevmActionsApi`\[`"setAccount"`\] | Directly sets any property of an account (balance, nonce, deployedBytecode, storage). **See** - [SetAccountParams](https://tevm.sh/reference/tevm/actions/type-aliases/setaccountparams/) - [SetAccountResult](https://tevm.sh/reference/tevm/actions/type-aliases/setaccountresult/) | [packages/memory-client/src/TevmActions.ts:64](https://github.com/evmts/tevm-monorepo/blob/main/packages/memory-client/src/TevmActions.ts#L64) |
