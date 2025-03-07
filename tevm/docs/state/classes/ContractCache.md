[**tevm**](../../README.md)

***

[tevm](../../modules.md) / [state](../README.md) / ContractCache

# Class: ContractCache

Defined in: packages/state/dist/index.d.ts:52

Contract cache is a mapping of addresses to deployedBytecode
It is implemented via extending StorageCache and hardcoding slot 0

## Constructors

### new ContractCache()

> **new ContractCache**(`storageCache`?): [`ContractCache`](ContractCache.md)

Defined in: packages/state/dist/index.d.ts:53

#### Parameters

##### storageCache?

[`StorageCache`](StorageCache.md)

#### Returns

[`ContractCache`](ContractCache.md)

## Properties

### storageCache

> **storageCache**: [`StorageCache`](StorageCache.md)

Defined in: packages/state/dist/index.d.ts:54

## Accessors

### \_checkpoints

#### Get Signature

> **get** **\_checkpoints**(): `number`

Defined in: packages/state/dist/index.d.ts:88

##### Returns

`number`

## Methods

### checkpoint()

> **checkpoint**(): `void`

Defined in: packages/state/dist/index.d.ts:82

#### Returns

`void`

***

### clear()

> **clear**(): `void`

Defined in: packages/state/dist/index.d.ts:62

#### Returns

`void`

***

### commit()

> **commit**(): `void`

Defined in: packages/state/dist/index.d.ts:58

#### Returns

`void`

***

### del()

> **del**(`address`): `void`

Defined in: packages/state/dist/index.d.ts:78

#### Parameters

##### address

[`EthjsAddress`](../../utils/classes/EthjsAddress.md)

#### Returns

`void`

***

### get()

> **get**(`address`): `undefined` \| `Uint8Array`\<`ArrayBufferLike`\>

Defined in: packages/state/dist/index.d.ts:67

#### Parameters

##### address

[`EthjsAddress`](../../utils/classes/EthjsAddress.md)

#### Returns

`undefined` \| `Uint8Array`\<`ArrayBufferLike`\>

***

### has()

> **has**(`address`): `boolean`

Defined in: packages/state/dist/index.d.ts:87

#### Parameters

##### address

[`EthjsAddress`](../../utils/classes/EthjsAddress.md)

#### Returns

`boolean`

if the cache has the key

***

### put()

> **put**(`address`, `bytecode`): `void`

Defined in: packages/state/dist/index.d.ts:73

#### Parameters

##### address

[`EthjsAddress`](../../utils/classes/EthjsAddress.md)

##### bytecode

`Uint8Array`

#### Returns

`void`

***

### revert()

> **revert**(): `void`

Defined in: packages/state/dist/index.d.ts:93

#### Returns

`void`

***

### size()

> **size**(): `number`

Defined in: packages/state/dist/index.d.ts:89

#### Returns

`number`
