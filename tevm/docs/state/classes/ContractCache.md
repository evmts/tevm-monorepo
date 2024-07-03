[**tevm**](../../README.md) • **Docs**

***

[tevm](../../modules.md) / [state](../README.md) / ContractCache

# Class: ContractCache

Contract cache is a mapping of addresses to deployedBytecode
It is implemented via extending StorageCache and hardcoding slot 0

## Constructors

### new ContractCache()

> **new ContractCache**(`storageCache`?): [`ContractCache`](ContractCache.md)

#### Parameters

• **storageCache?**: [`StorageCache`](StorageCache.md)

#### Returns

[`ContractCache`](ContractCache.md)

#### Defined in

packages/state/dist/index.d.ts:53

## Properties

### storageCache

> **storageCache**: [`StorageCache`](StorageCache.md)

#### Defined in

packages/state/dist/index.d.ts:54

## Accessors

### \_checkpoints

> `get` **\_checkpoints**(): `number`

#### Returns

`number`

#### Defined in

packages/state/dist/index.d.ts:88

## Methods

### checkpoint()

> **checkpoint**(): `void`

#### Returns

`void`

#### Defined in

packages/state/dist/index.d.ts:82

***

### clear()

> **clear**(): `void`

#### Returns

`void`

#### Defined in

packages/state/dist/index.d.ts:62

***

### commit()

> **commit**(): `void`

#### Returns

`void`

#### Defined in

packages/state/dist/index.d.ts:58

***

### del()

> **del**(`address`): `void`

#### Parameters

• **address**: [`EthjsAddress`](../../utils/classes/EthjsAddress.md)

#### Returns

`void`

#### Defined in

packages/state/dist/index.d.ts:78

***

### get()

> **get**(`address`): `undefined` \| `Uint8Array`

#### Parameters

• **address**: [`EthjsAddress`](../../utils/classes/EthjsAddress.md)

#### Returns

`undefined` \| `Uint8Array`

#### Defined in

packages/state/dist/index.d.ts:67

***

### has()

> **has**(`address`): `boolean`

#### Parameters

• **address**: [`EthjsAddress`](../../utils/classes/EthjsAddress.md)

#### Returns

`boolean`

if the cache has the key

#### Defined in

packages/state/dist/index.d.ts:87

***

### put()

> **put**(`address`, `bytecode`): `void`

#### Parameters

• **address**: [`EthjsAddress`](../../utils/classes/EthjsAddress.md)

• **bytecode**: `Uint8Array`

#### Returns

`void`

#### Defined in

packages/state/dist/index.d.ts:73

***

### revert()

> **revert**(): `void`

#### Returns

`void`

#### Defined in

packages/state/dist/index.d.ts:93

***

### size()

> **size**(): `number`

#### Returns

`number`

#### Defined in

packages/state/dist/index.d.ts:89
