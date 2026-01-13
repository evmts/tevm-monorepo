[**@tevm/mud**](../README.md)

***

[@tevm/mud](../globals.md) / CreateOptimisticHandlerResult

# Type Alias: CreateOptimisticHandlerResult\<TConfig\>

> **CreateOptimisticHandlerResult**\<`TConfig`\> = `object`

Defined in: [createOptimisticHandler.ts:62](https://github.com/evmts/tevm-monorepo/blob/main/bundler-packages/mud/src/createOptimisticHandler.ts#L62)

## Type Parameters

### TConfig

`TConfig` *extends* `StoreConfig` = `StoreConfig`

## Properties

### \_

> **\_**: `object`

Defined in: [createOptimisticHandler.ts:74](https://github.com/evmts/tevm-monorepo/blob/main/bundler-packages/mud/src/createOptimisticHandler.ts#L74)

#### cleanup()

> **cleanup**: () => `Promise`\<`void`\>

##### Returns

`Promise`\<`void`\>

#### internalClient

> **internalClient**: `MemoryClient`

#### optimisticClient

> **optimisticClient**: `MemoryClient`

#### optimisticStoreSubscribers

> **optimisticStoreSubscribers**: `StoreSubscribers`

#### optimisticTableSubscribers

> **optimisticTableSubscribers**: `TableSubscribers`

***

### getOptimisticRecord()

> **getOptimisticRecord**: \<`TTable`, `TDefaultValue`\>(`args`) => `GetRecordResult`\<`TTable`, `TDefaultValue`\>

Defined in: [createOptimisticHandler.ts:64](https://github.com/evmts/tevm-monorepo/blob/main/bundler-packages/mud/src/createOptimisticHandler.ts#L64)

#### Type Parameters

##### TTable

`TTable` *extends* `Table`

##### TDefaultValue

`TDefaultValue` *extends* `Omit`\<`TableRecord`\<`TTable`\>, keyof `Key`\<`TTable`\>\> \| `undefined` = `undefined`

#### Parameters

##### args

`Omit`\<`GetRecordArgs`\<`TTable`, `TDefaultValue`\>, `"stash"`\>

#### Returns

`GetRecordResult`\<`TTable`, `TDefaultValue`\>

***

### getOptimisticRecords()

> **getOptimisticRecords**: \<`TTable`\>(`args`) => `GetRecordsResult`\<`TTable`\>

Defined in: [createOptimisticHandler.ts:70](https://github.com/evmts/tevm-monorepo/blob/main/bundler-packages/mud/src/createOptimisticHandler.ts#L70)

#### Type Parameters

##### TTable

`TTable` *extends* `Table`

#### Parameters

##### args

`Omit`\<`GetRecordsArgs`\<`TTable`\>, `"stash"`\>

#### Returns

`GetRecordsResult`\<`TTable`\>

***

### getOptimisticState()

> **getOptimisticState**: () => `State`\<`TConfig`\>

Defined in: [createOptimisticHandler.ts:63](https://github.com/evmts/tevm-monorepo/blob/main/bundler-packages/mud/src/createOptimisticHandler.ts#L63)

#### Returns

`State`\<`TConfig`\>

***

### subscribeOptimisticState()

> **subscribeOptimisticState**: (`args`) => `Unsubscribe`

Defined in: [createOptimisticHandler.ts:71](https://github.com/evmts/tevm-monorepo/blob/main/bundler-packages/mud/src/createOptimisticHandler.ts#L71)

#### Parameters

##### args

###### subscriber

`StoreUpdatesSubscriber`

#### Returns

`Unsubscribe`

***

### subscribeTx()

> **subscribeTx**: (`args`) => `Unsubscribe`

Defined in: [createOptimisticHandler.ts:72](https://github.com/evmts/tevm-monorepo/blob/main/bundler-packages/mud/src/createOptimisticHandler.ts#L72)

#### Parameters

##### args

###### subscriber

[`TxStatusSubscriber`](TxStatusSubscriber.md)

#### Returns

`Unsubscribe`

***

### syncAdapter

> **syncAdapter**: `SyncAdapter`

Defined in: [createOptimisticHandler.ts:73](https://github.com/evmts/tevm-monorepo/blob/main/bundler-packages/mud/src/createOptimisticHandler.ts#L73)
