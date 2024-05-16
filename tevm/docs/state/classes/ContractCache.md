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

packages/state/dist/index.d.ts:50

## Properties

### storageCache

> **storageCache**: `StorageCache`

#### Source

packages/state/dist/index.d.ts:51

## Accessors

### \_checkpoints

> `get` **\_checkpoints**(): `number`

#### Returns

`number`

#### Source

packages/state/dist/index.d.ts:80

## Methods

### checkpoint()

> **checkpoint**(): `void`

#### Returns

`void`

#### Source

packages/state/dist/index.d.ts:79

***

### clear()

> **clear**(): `void`

#### Returns

`void`

#### Source

packages/state/dist/index.d.ts:59

***

### commit()

> **commit**(): `void`

#### Returns

`void`

#### Source

packages/state/dist/index.d.ts:55

***

### del()

> **del**(`address`): `void`

#### Parameters

• **address**: [`EthjsAddress`](../../utils/classes/EthjsAddress.md)

#### Returns

`void`

#### Source

packages/state/dist/index.d.ts:75

***

### get()

> **get**(`address`): `undefined` \| `Uint8Array`

#### Parameters

• **address**: [`EthjsAddress`](../../utils/classes/EthjsAddress.md)

#### Returns

`undefined` \| `Uint8Array`

#### Source

packages/state/dist/index.d.ts:64

***

### put()

> **put**(`address`, `bytecode`): `void`

#### Parameters

• **address**: [`EthjsAddress`](../../utils/classes/EthjsAddress.md)

• **bytecode**: `Uint8Array`

#### Returns

`void`

#### Source

packages/state/dist/index.d.ts:70

***

### revert()

> **revert**(): `void`

#### Returns

`void`

#### Source

packages/state/dist/index.d.ts:85

***

### size()

> **size**(): `number`

#### Returns

`number`

#### Source

packages/state/dist/index.d.ts:81
