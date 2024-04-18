**tevm** • [Readme](../../README.md) \| [API](../../modules.md)

***

[tevm](../../README.md) / [state](../README.md) / Cache

# Class: Cache

## Constructors

### new Cache(getContractStorage)

> **new Cache**(`getContractStorage`): [`Cache`](Cache.md)

#### Parameters

• **getContractStorage**: [`GetContractStorage`](../type-aliases/GetContractStorage.md)

#### Returns

[`Cache`](Cache.md)

#### Source

packages/state/types/Cache.d.ts:6

## Properties

### getContractStorage

> **`private`** **getContractStorage**: `any`

#### Source

packages/state/types/Cache.d.ts:5

***

### map

> **`private`** **map**: `any`

#### Source

packages/state/types/Cache.d.ts:4

## Methods

### clear()

> **clear**(): `void`

#### Returns

`void`

#### Source

packages/state/types/Cache.d.ts:9

***

### get()

> **get**(`address`, `key`): `Promise`\<`Uint8Array`\>

#### Parameters

• **address**: [`EthjsAddress`](../../utils/classes/EthjsAddress.md)

• **key**: `Uint8Array`

#### Returns

`Promise`\<`Uint8Array`\>

#### Source

packages/state/types/Cache.d.ts:7

***

### put()

> **put**(`address`, `key`, `value`): `void`

#### Parameters

• **address**: [`EthjsAddress`](../../utils/classes/EthjsAddress.md)

• **key**: `Uint8Array`

• **value**: `Uint8Array`

#### Returns

`void`

#### Source

packages/state/types/Cache.d.ts:8
