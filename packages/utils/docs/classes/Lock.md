**@tevm/utils** • [Readme](../README.md) \| [API](../globals.md)

***

[@tevm/utils](../README.md) / Lock

# Class: Lock

## Constructors

### new Lock()

> **new Lock**(): [`Lock`](Lock.md)

#### Returns

[`Lock`](Lock.md)

## Properties

### permits

> **`private`** **permits**: `any`

#### Source

node\_modules/.pnpm/@ethereumjs+util@9.0.3/node\_modules/@ethereumjs/util/dist/esm/lock.d.ts:2

***

### promiseResolverQueue

> **`private`** **promiseResolverQueue**: `any`

#### Source

node\_modules/.pnpm/@ethereumjs+util@9.0.3/node\_modules/@ethereumjs/util/dist/esm/lock.d.ts:3

## Methods

### acquire()

> **acquire**(): `Promise`\<`boolean`\>

Returns a promise used to wait for a permit to become available. This method should be awaited on.

#### Returns

`Promise`\<`boolean`\>

A promise that gets resolved when execution is allowed to proceed.

#### Source

node\_modules/.pnpm/@ethereumjs+util@9.0.3/node\_modules/@ethereumjs/util/dist/esm/lock.d.ts:8

***

### release()

> **release**(): `void`

Increases the number of permits by one. If there are other functions waiting, one of them will
continue to execute in a future iteration of the event loop.

#### Returns

`void`

#### Source

node\_modules/.pnpm/@ethereumjs+util@9.0.3/node\_modules/@ethereumjs/util/dist/esm/lock.d.ts:13
