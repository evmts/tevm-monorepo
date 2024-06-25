[**@tevm/state**](../README.md) • **Docs**

***

[@tevm/state](../globals.md) / ContractCache

# Class: ContractCache

Contract cache is a mapping of addresses to deployedBytecode
It is implemented via extending StorageCache and hardcoding slot 0

## Constructors

### new ContractCache()

> **new ContractCache**(`storageCache`): [`ContractCache`](ContractCache.md)

#### Parameters

• **storageCache**: `StorageCache` = `...`

#### Returns

[`ContractCache`](ContractCache.md)

#### Defined in

[packages/state/src/ContractCache.js:11](https://github.com/evmts/tevm-monorepo/blob/main/packages/state/src/ContractCache.js#L11)

## Properties

### storageCache

> **storageCache**: `StorageCache`

#### Defined in

[packages/state/src/ContractCache.js:17](https://github.com/evmts/tevm-monorepo/blob/main/packages/state/src/ContractCache.js#L17)

## Accessors

### \_checkpoints

> `get` **\_checkpoints**(): `number`

#### Returns

`number`

#### Defined in

[packages/state/src/ContractCache.js:75](https://github.com/evmts/tevm-monorepo/blob/main/packages/state/src/ContractCache.js#L75)

## Methods

### checkpoint()

> **checkpoint**(): `void`

#### Returns

`void`

#### Defined in

[packages/state/src/ContractCache.js:62](https://github.com/evmts/tevm-monorepo/blob/main/packages/state/src/ContractCache.js#L62)

***

### clear()

> **clear**(): `void`

#### Returns

`void`

#### Defined in

[packages/state/src/ContractCache.js:30](https://github.com/evmts/tevm-monorepo/blob/main/packages/state/src/ContractCache.js#L30)

***

### commit()

> **commit**(): `void`

#### Returns

`void`

#### Defined in

[packages/state/src/ContractCache.js:23](https://github.com/evmts/tevm-monorepo/blob/main/packages/state/src/ContractCache.js#L23)

***

### del()

> **del**(`address`): `void`

#### Parameters

• **address**: `Address`

#### Returns

`void`

#### Defined in

[packages/state/src/ContractCache.js:55](https://github.com/evmts/tevm-monorepo/blob/main/packages/state/src/ContractCache.js#L55)

***

### get()

> **get**(`address`): `undefined` \| `Uint8Array`

#### Parameters

• **address**: `Address`

#### Returns

`undefined` \| `Uint8Array`

#### Defined in

[packages/state/src/ContractCache.js:38](https://github.com/evmts/tevm-monorepo/blob/main/packages/state/src/ContractCache.js#L38)

***

### has()

> **has**(`address`): `boolean`

#### Parameters

• **address**: `Address`

#### Returns

`boolean`

if the cache has the key

#### Defined in

[packages/state/src/ContractCache.js:70](https://github.com/evmts/tevm-monorepo/blob/main/packages/state/src/ContractCache.js#L70)

***

### put()

> **put**(`address`, `bytecode`): `void`

#### Parameters

• **address**: `Address`

• **bytecode**: `Uint8Array`

#### Returns

`void`

#### Defined in

[packages/state/src/ContractCache.js:47](https://github.com/evmts/tevm-monorepo/blob/main/packages/state/src/ContractCache.js#L47)

***

### revert()

> **revert**(): `void`

#### Returns

`void`

#### Defined in

[packages/state/src/ContractCache.js:86](https://github.com/evmts/tevm-monorepo/blob/main/packages/state/src/ContractCache.js#L86)

***

### size()

> **size**(): `number`

#### Returns

`number`

#### Defined in

[packages/state/src/ContractCache.js:79](https://github.com/evmts/tevm-monorepo/blob/main/packages/state/src/ContractCache.js#L79)
