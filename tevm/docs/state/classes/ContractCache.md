**tevm** ∙ [README](../../README.md) ∙ [API](../../API.md)

***

[API](../../API.md) > [state](../README.md) > ContractCache

# Class: ContractCache

Contract cache is a mapping of addresses to deployedBytecode
It is implemented via extending StorageCache and hardcoding slot 0

## Constructors

### new ContractCache(storageCache)

> **new ContractCache**(`storageCache`?): [`ContractCache`](ContractCache.md)

#### Parameters

▪ **storageCache?**: `StorageCache`

#### Source

packages/state/types/ContractCache.d.ts:6

## Properties

### storageCache

> **storageCache**: `StorageCache`

#### Source

packages/state/types/ContractCache.d.ts:7

## Accessors

### \_checkpoints

> **`get`** **\_checkpoints**(): `number`

#### Source

packages/state/types/ContractCache.d.ts:36

## Methods

### checkpoint()

> **checkpoint**(): `void`

#### Returns

#### Source

packages/state/types/ContractCache.d.ts:35

***

### clear()

> **clear**(): `void`

#### Returns

#### Source

packages/state/types/ContractCache.d.ts:15

***

### commit()

> **commit**(): `void`

#### Returns

#### Source

packages/state/types/ContractCache.d.ts:11

***

### del()

> **del**(`address`): `void`

#### Parameters

▪ **address**: [`EthjsAddress`](../../utils/classes/EthjsAddress.md)

#### Returns

#### Source

packages/state/types/ContractCache.d.ts:31

***

### get()

> **get**(`address`): `undefined` \| `Uint8Array`

#### Parameters

▪ **address**: [`EthjsAddress`](../../utils/classes/EthjsAddress.md)

#### Returns

#### Source

packages/state/types/ContractCache.d.ts:20

***

### put()

> **put**(`address`, `bytecode`): `void`

#### Parameters

▪ **address**: [`EthjsAddress`](../../utils/classes/EthjsAddress.md)

▪ **bytecode**: `Uint8Array`

#### Returns

#### Source

packages/state/types/ContractCache.d.ts:26

***

### revert()

> **revert**(): `void`

#### Returns

#### Source

packages/state/types/ContractCache.d.ts:41

***

### size()

> **size**(): `number`

#### Source

packages/state/types/ContractCache.d.ts:37

***
Generated using [typedoc-plugin-markdown](https://www.npmjs.com/package/typedoc-plugin-markdown) and [TypeDoc](https://typedoc.org/)
