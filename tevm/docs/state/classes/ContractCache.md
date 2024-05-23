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

• **storageCache?**: `StorageCache`

#### Returns

[`ContractCache`](ContractCache.md)

#### Source

packages/state/dist/index.d.ts:52

## Properties

### storageCache

> **storageCache**: `StorageCache`

#### Source

packages/state/dist/index.d.ts:53

## Accessors

### \_checkpoints

> `get` **\_checkpoints**(): `number`

#### Returns

`number`

#### Source

packages/state/dist/index.d.ts:82

## Methods

### checkpoint()

> **checkpoint**(): `void`

#### Returns

`void`

#### Source

packages/state/dist/index.d.ts:81

***

### clear()

> **clear**(): `void`

#### Returns

`void`

#### Source

packages/state/dist/index.d.ts:61

***

### commit()

> **commit**(): `void`

#### Returns

`void`

#### Source

packages/state/dist/index.d.ts:57

***

### del()

> **del**(`address`): `void`

#### Parameters

• **address**: [`EthjsAddress`](../../utils/classes/EthjsAddress.md)

#### Returns

`void`

#### Source

packages/state/dist/index.d.ts:77

***

### get()

> **get**(`address`): `undefined` \| `Uint8Array`

#### Parameters

• **address**: [`EthjsAddress`](../../utils/classes/EthjsAddress.md)

#### Returns

`undefined` \| `Uint8Array`

#### Source

packages/state/dist/index.d.ts:66

***

### put()

> **put**(`address`, `bytecode`): `void`

#### Parameters

• **address**: [`EthjsAddress`](../../utils/classes/EthjsAddress.md)

• **bytecode**: `Uint8Array`

#### Returns

`void`

#### Source

packages/state/dist/index.d.ts:72

***

### revert()

> **revert**(): `void`

#### Returns

`void`

#### Source

packages/state/dist/index.d.ts:87

***

### size()

> **size**(): `number`

#### Returns

`number`

#### Source

packages/state/dist/index.d.ts:83
