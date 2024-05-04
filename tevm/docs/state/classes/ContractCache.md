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

packages/state/dist/index.d.ts:48

## Properties

### storageCache

> **storageCache**: `StorageCache`

#### Source

packages/state/dist/index.d.ts:49

## Accessors

### \_checkpoints

> **`get`** **\_checkpoints**(): `number`

#### Source

packages/state/dist/index.d.ts:78

## Methods

### checkpoint()

> **checkpoint**(): `void`

#### Returns

#### Source

packages/state/dist/index.d.ts:77

***

### clear()

> **clear**(): `void`

#### Returns

#### Source

packages/state/dist/index.d.ts:57

***

### commit()

> **commit**(): `void`

#### Returns

#### Source

packages/state/dist/index.d.ts:53

***

### del()

> **del**(`address`): `void`

#### Parameters

▪ **address**: [`EthjsAddress`](../../utils/classes/EthjsAddress.md)

#### Returns

#### Source

packages/state/dist/index.d.ts:73

***

### get()

> **get**(`address`): `undefined` \| `Uint8Array`

#### Parameters

▪ **address**: [`EthjsAddress`](../../utils/classes/EthjsAddress.md)

#### Returns

#### Source

packages/state/dist/index.d.ts:62

***

### put()

> **put**(`address`, `bytecode`): `void`

#### Parameters

▪ **address**: [`EthjsAddress`](../../utils/classes/EthjsAddress.md)

▪ **bytecode**: `Uint8Array`

#### Returns

#### Source

packages/state/dist/index.d.ts:68

***

### revert()

> **revert**(): `void`

#### Returns

#### Source

packages/state/dist/index.d.ts:83

***

### size()

> **size**(): `number`

#### Source

packages/state/dist/index.d.ts:79

***
Generated using [typedoc-plugin-markdown](https://www.npmjs.com/package/typedoc-plugin-markdown) and [TypeDoc](https://typedoc.org/)
