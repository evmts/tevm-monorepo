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

packages/state/dist/index.d.ts:50

## Properties

### storageCache

> **storageCache**: `StorageCache`

#### Source

packages/state/dist/index.d.ts:51

## Accessors

### \_checkpoints

> **`get`** **\_checkpoints**(): `number`

#### Source

packages/state/dist/index.d.ts:80

## Methods

### checkpoint()

> **checkpoint**(): `void`

#### Returns

#### Source

packages/state/dist/index.d.ts:79

***

### clear()

> **clear**(): `void`

#### Returns

#### Source

packages/state/dist/index.d.ts:59

***

### commit()

> **commit**(): `void`

#### Returns

#### Source

packages/state/dist/index.d.ts:55

***

### del()

> **del**(`address`): `void`

#### Parameters

▪ **address**: [`EthjsAddress`](../../utils/classes/EthjsAddress.md)

#### Returns

#### Source

packages/state/dist/index.d.ts:75

***

### get()

> **get**(`address`): `undefined` \| `Uint8Array`

#### Parameters

▪ **address**: [`EthjsAddress`](../../utils/classes/EthjsAddress.md)

#### Returns

#### Source

packages/state/dist/index.d.ts:64

***

### put()

> **put**(`address`, `bytecode`): `void`

#### Parameters

▪ **address**: [`EthjsAddress`](../../utils/classes/EthjsAddress.md)

▪ **bytecode**: `Uint8Array`

#### Returns

#### Source

packages/state/dist/index.d.ts:70

***

### revert()

> **revert**(): `void`

#### Returns

#### Source

packages/state/dist/index.d.ts:85

***

### size()

> **size**(): `number`

#### Source

packages/state/dist/index.d.ts:81

***
Generated using [typedoc-plugin-markdown](https://www.npmjs.com/package/typedoc-plugin-markdown) and [TypeDoc](https://typedoc.org/)
