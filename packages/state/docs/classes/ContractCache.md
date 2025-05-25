[**@tevm/state**](../README.md)

***

[@tevm/state](../globals.md) / ContractCache

# Class: ContractCache

Defined in: packages/state/src/ContractCache.js:10

Contract cache is a mapping of addresses to deployedBytecode
It is implemented via extending StorageCache and hardcoding slot 0

## Constructors

### Constructor

> **new ContractCache**(`storageCache`): `ContractCache`

Defined in: packages/state/src/ContractCache.js:11

#### Parameters

##### storageCache

[`StorageCache`](StorageCache.md) = `...`

#### Returns

`ContractCache`

## Properties

### storageCache

> **storageCache**: [`StorageCache`](StorageCache.md)

Defined in: packages/state/src/ContractCache.js:17

## Accessors

### \_checkpoints

#### Get Signature

> **get** **\_checkpoints**(): `number`

Defined in: packages/state/src/ContractCache.js:77

##### Returns

`number`

## Methods

### checkpoint()

> **checkpoint**(): `void`

Defined in: packages/state/src/ContractCache.js:62

#### Returns

`void`

***

### clear()

> **clear**(): `void`

Defined in: packages/state/src/ContractCache.js:30

#### Returns

`void`

***

### commit()

> **commit**(): `void`

Defined in: packages/state/src/ContractCache.js:23

#### Returns

`void`

***

### del()

> **del**(`address`): `void`

Defined in: packages/state/src/ContractCache.js:55

#### Parameters

##### address

`Address`

#### Returns

`void`

***

### get()

> **get**(`address`): `undefined` \| `Uint8Array`\<`ArrayBufferLike`\>

Defined in: packages/state/src/ContractCache.js:38

#### Parameters

##### address

`Address`

#### Returns

`undefined` \| `Uint8Array`\<`ArrayBufferLike`\>

***

### has()

> **has**(`address`): `boolean`

Defined in: packages/state/src/ContractCache.js:70

#### Parameters

##### address

`Address`

#### Returns

`boolean`

if the cache has the key

***

### put()

> **put**(`address`, `bytecode`): `void`

Defined in: packages/state/src/ContractCache.js:47

#### Parameters

##### address

`Address`

##### bytecode

`Uint8Array`\<`ArrayBufferLike`\>

#### Returns

`void`

***

### revert()

> **revert**(): `void`

Defined in: packages/state/src/ContractCache.js:88

#### Returns

`void`

***

### size()

> **size**(): `number`

Defined in: packages/state/src/ContractCache.js:81

#### Returns

`number`
