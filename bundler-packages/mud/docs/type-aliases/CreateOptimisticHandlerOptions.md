[**@tevm/mud**](../README.md)

***

[@tevm/mud](../globals.md) / CreateOptimisticHandlerOptions

# Type Alias: CreateOptimisticHandlerOptions\<TConfig\>

> **CreateOptimisticHandlerOptions**\<`TConfig`\> = `object`

Defined in: [createOptimisticHandler.ts:40](https://github.com/evmts/tevm-monorepo/blob/main/bundler-packages/mud/src/createOptimisticHandler.ts#L40)

## Type Parameters

| Type Parameter | Default type |
| ------ | ------ |
| `TConfig` *extends* `StoreConfig` | `StoreConfig` |

## Properties

| Property | Type | Description | Defined in |
| ------ | ------ | ------ | ------ |
| <a id="client"></a> `client` | `Client` \| [`SessionClient`](SessionClient.md) | A base viem client | [createOptimisticHandler.ts:42](https://github.com/evmts/tevm-monorepo/blob/main/bundler-packages/mud/src/createOptimisticHandler.ts#L42) |
| <a id="config"></a> `config?` | `TConfig` | The store config | [createOptimisticHandler.ts:57](https://github.com/evmts/tevm-monorepo/blob/main/bundler-packages/mud/src/createOptimisticHandler.ts#L57) |
| <a id="logginglevel"></a> `loggingLevel?` | `"debug"` \| `"error"` \| `"fatal"` \| `"info"` \| `"trace"` \| `"warn"` | The logging level for Tevm clients | [createOptimisticHandler.ts:59](https://github.com/evmts/tevm-monorepo/blob/main/bundler-packages/mud/src/createOptimisticHandler.ts#L59) |
| <a id="stash"></a> `stash` | `Stash`\<`TConfig`\> | The state manager (here stash) | [createOptimisticHandler.ts:46](https://github.com/evmts/tevm-monorepo/blob/main/bundler-packages/mud/src/createOptimisticHandler.ts#L46) |
| <a id="storeaddress"></a> `storeAddress` | `Address` | The address of the store contract | [createOptimisticHandler.ts:44](https://github.com/evmts/tevm-monorepo/blob/main/bundler-packages/mud/src/createOptimisticHandler.ts#L44) |
| <a id="sync"></a> `sync?` | `object` | Sync options | [createOptimisticHandler.ts:48](https://github.com/evmts/tevm-monorepo/blob/main/bundler-packages/mud/src/createOptimisticHandler.ts#L48) |
| `sync.enabled?` | `boolean` | Whether to enable sync (default: true) | [createOptimisticHandler.ts:51](https://github.com/evmts/tevm-monorepo/blob/main/bundler-packages/mud/src/createOptimisticHandler.ts#L51) |
| `sync.startBlock?` | `bigint` | The block number to start syncing from (default: 0n) | [createOptimisticHandler.ts:53](https://github.com/evmts/tevm-monorepo/blob/main/bundler-packages/mud/src/createOptimisticHandler.ts#L53) |
