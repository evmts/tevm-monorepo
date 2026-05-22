[**tevm**](../../README.md)

***

[tevm](../../modules.md) / [index](../README.md) / TevmActions

# Type Alias: TevmActions

> **TevmActions** = `object`

Provides powerful actions for interacting with the EVM using the TEVM API.
These actions allow for low-level access to the EVM, managing accounts, deploying contracts, and more.

## See

 - [Actions Guide](https://tevm.sh/learn/actions/)
 - [Viem Actions API](https://viem.sh/docs/actions/introduction)

## Properties

| Property | Type | Description |
| ------ | ------ | ------ |
| <a id="tevmcall"></a> `tevmCall` | [`TevmActionsApi`](TevmActionsApi.md)\[`"call"`\] | Low-level call/transaction API. To send a transaction (rather than a call), pass `createTransaction: true` and mine the result (or use `miningConfig: { type: 'auto' }`). Supports impersonation (`from`/`caller`/`origin`), `depth`, `createTrace`, `createAccessList`, and more. **See** - [CallParams](https://tevm.sh/reference/tevm/actions/type-aliases/callparams/) - [CallResult](https://tevm.sh/reference/tevm/actions/type-aliases/callresult/) |
| <a id="tevmcontract"></a> `tevmContract` | [`TevmActionsApi`](TevmActionsApi.md)\[`"contract"`\] | Higher-level contract call: handles ABI encoding/decoding and revert messages. Same options as `tevmCall` apply (impersonation, tracing, access list, `createTransaction`). **See** - [ContractParams](https://tevm.sh/reference/tevm/actions/type-aliases/contractparams/) - [ContractResult](https://tevm.sh/reference/tevm/actions/type-aliases/contractresult/) |
| <a id="tevmdeal"></a> `tevmDeal` | [`TevmActionsApi`](TevmActionsApi.md)\[`"deal"`\] | Convenience wrapper over `tevmSetAccount` for setting ETH or ERC20 balances. **See** - [DealParams](https://tevm.sh/reference/tevm/actions/type-aliases/dealparams/) - [DealResult](https://tevm.sh/reference/tevm/actions/type-aliases/dealresult/) **Example** `await client.tevmDeal({ erc20: '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48', account: '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266', amount: 1000000n, })` |
| <a id="tevmdeploy"></a> `tevmDeploy` | [`TevmActionsApi`](TevmActionsApi.md)\[`"deploy"`\] | Deploys a contract with encoded constructor arguments. Inherits all `tevmCall` options. **See** - [DeployParams](https://tevm.sh/reference/tevm/actions/type-aliases/deployparams/) - [DeployResult](https://tevm.sh/reference/tevm/actions/type-aliases/deployresult/) |
| <a id="tevmdumpstate"></a> `tevmDumpState` | [`TevmActionsApi`](TevmActionsApi.md)\[`"dumpState"`\] | Dumps the EVM state as a JSON-serializable object for persistence. |
| <a id="tevmgetaccount"></a> `tevmGetAccount` | [`TevmActionsApi`](TevmActionsApi.md)\[`"getAccount"`\] | Reads an account's state. Storage is only included if `returnStorage: true`, and in fork mode only already-cached slots are returned. **See** - [GetAccountParams](https://tevm.sh/reference/tevm/actions/type-aliases/getaccountparams/) - [GetAccountResult](https://tevm.sh/reference/tevm/actions/type-aliases/getaccountresult/) |
| <a id="tevmloadstate"></a> `tevmLoadState` | [`TevmActionsApi`](TevmActionsApi.md)\[`"loadState"`\] | Loads a previously dumped state into the EVM. |
| <a id="tevmmine"></a> `tevmMine` | [`TevmActionsApi`](TevmActionsApi.md)\[`"mine"`\] | Mines pending transactions into a new block. Required in manual mining mode to advance canonical state. |
| <a id="tevmready"></a> `tevmReady` | () => `Promise`\<`true`\> | Resolves when the TEVM is ready. All other actions await this implicitly. Equivalent to `client.transport.tevm.ready()`. |
| <a id="tevmsetaccount"></a> `tevmSetAccount` | [`TevmActionsApi`](TevmActionsApi.md)\[`"setAccount"`\] | Directly sets any property of an account (balance, nonce, deployedBytecode, storage). **See** - [SetAccountParams](https://tevm.sh/reference/tevm/actions/type-aliases/setaccountparams/) - [SetAccountResult](https://tevm.sh/reference/tevm/actions/type-aliases/setaccountresult/) |
