[**@tevm/mud**](../README.md)

***

[@tevm/mud](../globals.md) / CreateOptimisticHandlerOptions

# Type Alias: CreateOptimisticHandlerOptions\<TConfig\>

> **CreateOptimisticHandlerOptions**\<`TConfig`\> = `object`

Defined in: [createOptimisticHandler.ts:40](https://github.com/evmts/tevm-monorepo/blob/main/bundler-packages/mud/src/createOptimisticHandler.ts#L40)

## Type Parameters

### TConfig

`TConfig` *extends* `StoreConfig` = `StoreConfig`

## Properties

### client

> **client**: `Client` \| [`SessionClient`](SessionClient.md)

Defined in: [createOptimisticHandler.ts:42](https://github.com/evmts/tevm-monorepo/blob/main/bundler-packages/mud/src/createOptimisticHandler.ts#L42)

A base viem client

***

### config?

> `optional` **config**: `TConfig`

Defined in: [createOptimisticHandler.ts:57](https://github.com/evmts/tevm-monorepo/blob/main/bundler-packages/mud/src/createOptimisticHandler.ts#L57)

The store config

***

### loggingLevel?

> `optional` **loggingLevel**: `"debug"` \| `"error"` \| `"fatal"` \| `"info"` \| `"trace"` \| `"warn"`

Defined in: [createOptimisticHandler.ts:59](https://github.com/evmts/tevm-monorepo/blob/main/bundler-packages/mud/src/createOptimisticHandler.ts#L59)

The logging level for Tevm clients

***

### stash

> **stash**: `Stash`\<`TConfig`\>

Defined in: [createOptimisticHandler.ts:46](https://github.com/evmts/tevm-monorepo/blob/main/bundler-packages/mud/src/createOptimisticHandler.ts#L46)

The state manager (here stash)

***

### storeAddress

> **storeAddress**: `Address`

Defined in: [createOptimisticHandler.ts:44](https://github.com/evmts/tevm-monorepo/blob/main/bundler-packages/mud/src/createOptimisticHandler.ts#L44)

The address of the store contract

***

### sync?

> `optional` **sync**: `object`

Defined in: [createOptimisticHandler.ts:48](https://github.com/evmts/tevm-monorepo/blob/main/bundler-packages/mud/src/createOptimisticHandler.ts#L48)

Sync options

#### enabled?

> `optional` **enabled**: `boolean`

Whether to enable sync (default: true)

#### startBlock?

> `optional` **startBlock**: `bigint`

The block number to start syncing from (default: 0n)
