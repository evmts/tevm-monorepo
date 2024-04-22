**@tevm/state** ∙ [README](../README.md) ∙ [API](../API.md)

***

[API](../API.md) > ContractCache

# Class: ContractCache

Contract cache is a mapping of addresses to deployedBytecode
It is implemented via extending StorageCache and hardcoding slot 0

## Constructors

### new ContractCache(storageCache)

> **new ContractCache**(`storageCache`): [`ContractCache`](ContractCache.md)

#### Parameters

▪ **storageCache**: `StorageCache`= `undefined`

#### Source

[packages/state/src/ContractCache.js:10](https://github.com/evmts/tevm-monorepo/blob/main/packages/state/src/ContractCache.js#L10)

## Properties

### storageCache

> **storageCache**: `StorageCache`

#### Source

[packages/state/src/ContractCache.js:16](https://github.com/evmts/tevm-monorepo/blob/main/packages/state/src/ContractCache.js#L16)

## Methods

### checkpoint()

> **checkpoint**(): `void`

#### Returns

#### Source

[packages/state/src/ContractCache.js:61](https://github.com/evmts/tevm-monorepo/blob/main/packages/state/src/ContractCache.js#L61)

***

### clear()

> **clear**(): `void`

#### Returns

#### Source

[packages/state/src/ContractCache.js:29](https://github.com/evmts/tevm-monorepo/blob/main/packages/state/src/ContractCache.js#L29)

***

### commit()

> **commit**(): `void`

#### Returns

#### Source

[packages/state/src/ContractCache.js:22](https://github.com/evmts/tevm-monorepo/blob/main/packages/state/src/ContractCache.js#L22)

***

### del()

> **del**(`address`): `void`

#### Parameters

▪ **address**: `Address`

#### Returns

#### Source

[packages/state/src/ContractCache.js:54](https://github.com/evmts/tevm-monorepo/blob/main/packages/state/src/ContractCache.js#L54)

***

### get()

> **get**(`address`): `undefined` \| `Uint8Array`

#### Parameters

▪ **address**: `Address`

#### Returns

#### Source

[packages/state/src/ContractCache.js:37](https://github.com/evmts/tevm-monorepo/blob/main/packages/state/src/ContractCache.js#L37)

***

### put()

> **put**(`address`, `bytecode`): `void`

#### Parameters

▪ **address**: `Address`

▪ **bytecode**: `Uint8Array`

#### Returns

#### Source

[packages/state/src/ContractCache.js:46](https://github.com/evmts/tevm-monorepo/blob/main/packages/state/src/ContractCache.js#L46)

***

### revert()

> **revert**(): `void`

#### Returns

#### Source

[packages/state/src/ContractCache.js:68](https://github.com/evmts/tevm-monorepo/blob/main/packages/state/src/ContractCache.js#L68)

***
Generated using [typedoc-plugin-markdown](https://www.npmjs.com/package/typedoc-plugin-markdown) and [TypeDoc](https://typedoc.org/)
