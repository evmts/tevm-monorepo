---
editUrl: false
next: false
prev: false
title: "ContractCache"
---

Contract cache is a mapping of addresses to deployedBytecode
It is implemented via extending StorageCache and hardcoding slot 0

## Constructors

### new ContractCache()

> **new ContractCache**(`storageCache`): [`ContractCache`](/reference/tevm/state/classes/contractcache/)

#### Parameters

• **storageCache**: `StorageCache`= `undefined`

#### Returns

[`ContractCache`](/reference/tevm/state/classes/contractcache/)

#### Source

[packages/state/src/ContractCache.js:10](https://github.com/evmts/tevm-monorepo/blob/main/packages/state/src/ContractCache.js#L10)

## Properties

### storageCache

> **storageCache**: `StorageCache`

#### Source

[packages/state/src/ContractCache.js:16](https://github.com/evmts/tevm-monorepo/blob/main/packages/state/src/ContractCache.js#L16)

## Accessors

### \_checkpoints

> `get` **\_checkpoints**(): `number`

#### Returns

`number`

#### Source

[packages/state/src/ContractCache.js:65](https://github.com/evmts/tevm-monorepo/blob/main/packages/state/src/ContractCache.js#L65)

## Methods

### checkpoint()

> **checkpoint**(): `void`

#### Returns

`void`

#### Source

[packages/state/src/ContractCache.js:61](https://github.com/evmts/tevm-monorepo/blob/main/packages/state/src/ContractCache.js#L61)

***

### clear()

> **clear**(): `void`

#### Returns

`void`

#### Source

[packages/state/src/ContractCache.js:29](https://github.com/evmts/tevm-monorepo/blob/main/packages/state/src/ContractCache.js#L29)

***

### commit()

> **commit**(): `void`

#### Returns

`void`

#### Source

[packages/state/src/ContractCache.js:22](https://github.com/evmts/tevm-monorepo/blob/main/packages/state/src/ContractCache.js#L22)

***

### del()

> **del**(`address`): `void`

#### Parameters

• **address**: [`EthjsAddress`](/reference/tevm/utils/classes/ethjsaddress/)

#### Returns

`void`

#### Source

[packages/state/src/ContractCache.js:54](https://github.com/evmts/tevm-monorepo/blob/main/packages/state/src/ContractCache.js#L54)

***

### get()

> **get**(`address`): `undefined` \| `Uint8Array`

#### Parameters

• **address**: [`EthjsAddress`](/reference/tevm/utils/classes/ethjsaddress/)

#### Returns

`undefined` \| `Uint8Array`

#### Source

[packages/state/src/ContractCache.js:37](https://github.com/evmts/tevm-monorepo/blob/main/packages/state/src/ContractCache.js#L37)

***

### put()

> **put**(`address`, `bytecode`): `void`

#### Parameters

• **address**: [`EthjsAddress`](/reference/tevm/utils/classes/ethjsaddress/)

• **bytecode**: `Uint8Array`

#### Returns

`void`

#### Source

[packages/state/src/ContractCache.js:46](https://github.com/evmts/tevm-monorepo/blob/main/packages/state/src/ContractCache.js#L46)

***

### revert()

> **revert**(): `void`

#### Returns

`void`

#### Source

[packages/state/src/ContractCache.js:76](https://github.com/evmts/tevm-monorepo/blob/main/packages/state/src/ContractCache.js#L76)

***

### size()

> **size**(): `number`

#### Returns

`number`

#### Source

[packages/state/src/ContractCache.js:69](https://github.com/evmts/tevm-monorepo/blob/main/packages/state/src/ContractCache.js#L69)
