[**@tevm/mud**](../README.md)

***

[@tevm/mud](../globals.md) / CreateOptimisticHandlerResult

# Type Alias: CreateOptimisticHandlerResult\<TConfig\>

> **CreateOptimisticHandlerResult**\<`TConfig`\> = `object`

Defined in: [createOptimisticHandler.ts:62](https://github.com/evmts/tevm-monorepo/blob/main/bundler-packages/mud/src/createOptimisticHandler.ts#L62)

## Type Parameters

| Type Parameter | Default type |
| ------ | ------ |
| `TConfig` *extends* `StoreConfig` | `StoreConfig` |

## Properties

| Property | Type | Defined in |
| ------ | ------ | ------ |
| <a id="_"></a> `_` | `object` | [createOptimisticHandler.ts:74](https://github.com/evmts/tevm-monorepo/blob/main/bundler-packages/mud/src/createOptimisticHandler.ts#L74) |
| `_.cleanup` | () => `Promise`\<`void`\> | [createOptimisticHandler.ts:79](https://github.com/evmts/tevm-monorepo/blob/main/bundler-packages/mud/src/createOptimisticHandler.ts#L79) |
| `_.internalClient` | `MemoryClient` | [createOptimisticHandler.ts:76](https://github.com/evmts/tevm-monorepo/blob/main/bundler-packages/mud/src/createOptimisticHandler.ts#L76) |
| `_.optimisticClient` | `MemoryClient` | [createOptimisticHandler.ts:75](https://github.com/evmts/tevm-monorepo/blob/main/bundler-packages/mud/src/createOptimisticHandler.ts#L75) |
| `_.optimisticStoreSubscribers` | `StoreSubscribers` | [createOptimisticHandler.ts:77](https://github.com/evmts/tevm-monorepo/blob/main/bundler-packages/mud/src/createOptimisticHandler.ts#L77) |
| `_.optimisticTableSubscribers` | `TableSubscribers` | [createOptimisticHandler.ts:78](https://github.com/evmts/tevm-monorepo/blob/main/bundler-packages/mud/src/createOptimisticHandler.ts#L78) |
| <a id="getoptimisticrecord"></a> `getOptimisticRecord` | \<`TTable`, `TDefaultValue`\>(`args`) => `GetRecordResult`\<`TTable`, `TDefaultValue`\> | [createOptimisticHandler.ts:64](https://github.com/evmts/tevm-monorepo/blob/main/bundler-packages/mud/src/createOptimisticHandler.ts#L64) |
| <a id="getoptimisticrecords"></a> `getOptimisticRecords` | \<`TTable`\>(`args`) => `GetRecordsResult`\<`TTable`\> | [createOptimisticHandler.ts:70](https://github.com/evmts/tevm-monorepo/blob/main/bundler-packages/mud/src/createOptimisticHandler.ts#L70) |
| <a id="getoptimisticstate"></a> `getOptimisticState` | () => `State`\<`TConfig`\> | [createOptimisticHandler.ts:63](https://github.com/evmts/tevm-monorepo/blob/main/bundler-packages/mud/src/createOptimisticHandler.ts#L63) |
| <a id="subscribeoptimisticstate"></a> `subscribeOptimisticState` | (`args`) => `Unsubscribe` | [createOptimisticHandler.ts:71](https://github.com/evmts/tevm-monorepo/blob/main/bundler-packages/mud/src/createOptimisticHandler.ts#L71) |
| <a id="subscribetx"></a> `subscribeTx` | (`args`) => `Unsubscribe` | [createOptimisticHandler.ts:72](https://github.com/evmts/tevm-monorepo/blob/main/bundler-packages/mud/src/createOptimisticHandler.ts#L72) |
| <a id="syncadapter"></a> `syncAdapter` | `SyncAdapter` | [createOptimisticHandler.ts:73](https://github.com/evmts/tevm-monorepo/blob/main/bundler-packages/mud/src/createOptimisticHandler.ts#L73) |
