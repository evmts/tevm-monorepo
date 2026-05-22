[**@tevm/decorators**](../README.md)

***

[@tevm/decorators](../globals.md) / EthActionsApi

# Type Alias: EthActionsApi

> **EthActionsApi** = `object`

Defined in: [actions/EthActionsApi.ts:16](https://github.com/evmts/tevm-monorepo/blob/main/packages/decorators/src/actions/EthActionsApi.ts#L16)

The actions api is the high level API for interacting with a Tevm client similar to [viem actions](https://viem.sh/learn/actions/)
These actions correspond 1:1 eith the public ethereum JSON-RPC api

## See

[https://tevm.sh/learn/actions/](https://tevm.sh/learn/actions/)

## Properties

| Property | Type | Description | Defined in |
| ------ | ------ | ------ | ------ |
| <a id="eth"></a> `eth` | `object` | Standard JSON-RPC methods for interacting with the VM **See** [JSON-RPC](https://ethereum.github.io/execution-apis/api-documentation/) | [actions/EthActionsApi.ts:21](https://github.com/evmts/tevm-monorepo/blob/main/packages/decorators/src/actions/EthActionsApi.ts#L21) |
| `eth.blockNumber` | `EthBlockNumberHandler` | Returns the current block number Set the `tag` to a block number or block hash to get the balance at that block Block tag defaults to 'pending' tag which is the optimistic state of the VM **See** [JSON-RPC](https://ethereum.github.io/execution-apis/api-documentation/) **Example** `const blockNumber = await tevm.eth.blockNumber() console.log(blockNumber) // 0n` | [actions/EthActionsApi.ts:31](https://github.com/evmts/tevm-monorepo/blob/main/packages/decorators/src/actions/EthActionsApi.ts#L31) |
| `eth.call` | `EthCallHandler` | Executes a call without modifying the state Set the `tag` to a block number or block hash to get the balance at that block Block tag defaults to 'pending' tag which is the optimistic state of the VM **See** [JSON-RPC](https://ethereum.github.io/execution-apis/api-documentation/) **Example** `const res = await tevm.eth.call({to: '0x123...', data: '0x123...'}) console.log(res) // "0x..."` | [actions/EthActionsApi.ts:41](https://github.com/evmts/tevm-monorepo/blob/main/packages/decorators/src/actions/EthActionsApi.ts#L41) |
| `eth.chainId` | `EthChainIdHandler` | Returns the current chain id Set the `tag` to a block number or block hash to get the balance at that block Block tag defaults to 'pending' tag which is the optimistic state of the VM **See** [JSON-RPC](https://ethereum.github.io/execution-apis/api-documentation/) **Example** `const chainId = await tevm.eth.chainId() console.log(chainId) // 10n` | [actions/EthActionsApi.ts:51](https://github.com/evmts/tevm-monorepo/blob/main/packages/decorators/src/actions/EthActionsApi.ts#L51) |
| `eth.gasPrice` | `EthGasPriceHandler` | Returns the current gas price Set the `tag` to a block number or block hash to get the balance at that block Block tag defaults to 'pending' tag which is the optimistic state of the VM **See** [JSON-RPC](https://ethereum.github.io/execution-apis/api-documentation/) **Example** `const gasPrice = await tevm.eth.gasPrice() console.log(gasPrice) // 0n` | [actions/EthActionsApi.ts:79](https://github.com/evmts/tevm-monorepo/blob/main/packages/decorators/src/actions/EthActionsApi.ts#L79) |
| `eth.getBalance` | `EthGetBalanceHandler` | Returns the balance of a given address Set the `tag` to a block number or block hash to get the balance at that block Block tag defaults to 'pending' tag which is the optimistic state of the VM **See** [JSON-RPC](https://ethereum.github.io/execution-apis/api-documentation/) **Example** `const balance = await tevm.eth.getBalance({address: '0x123...', tag: 'pending'}) console.log(gasPrice) // 0n` | [actions/EthActionsApi.ts:89](https://github.com/evmts/tevm-monorepo/blob/main/packages/decorators/src/actions/EthActionsApi.ts#L89) |
| `eth.getCode` | `EthGetCodeHandler` | Returns code at a given address Set the `tag` to a block number or block hash to get the balance at that block Block tag defaults to 'pending' tag which is the optimistic state of the VM **See** [JSON-RPC](https://ethereum.github.io/execution-apis/api-documentation/) **Example** `const code = await tevm.eth.getCode({address: '0x123...'})` | [actions/EthActionsApi.ts:60](https://github.com/evmts/tevm-monorepo/blob/main/packages/decorators/src/actions/EthActionsApi.ts#L60) |
| `eth.getStorageAt` | `EthGetStorageAtHandler` | Returns storage at a given address and slot Set the `tag` to a block number or block hash to get the balance at that block Block tag defaults to 'pending' tag which is the optimistic state of the VM **See** [JSON-RPC](https://ethereum.github.io/execution-apis/api-documentation/) **Example** `const storageValue = await tevm.eth.getStorageAt({address: '0x123...', position: 0})` | [actions/EthActionsApi.ts:69](https://github.com/evmts/tevm-monorepo/blob/main/packages/decorators/src/actions/EthActionsApi.ts#L69) |
