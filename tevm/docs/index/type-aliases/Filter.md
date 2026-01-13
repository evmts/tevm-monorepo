[**tevm**](../../README.md)

***

[tevm](../../modules.md) / [index](../README.md) / Filter

# Type Alias: Filter

> **Filter** = `object`

Defined in: packages/node/dist/index.d.ts:317

Internal representation of a registered filter

## Properties

### blocks

> **blocks**: [`Block`](../../block/classes/Block.md)[]

Defined in: packages/node/dist/index.d.ts:346

Stores the blocks

***

### created

> **created**: `number`

Defined in: packages/node/dist/index.d.ts:329

Creation timestamp

***

### err

> **err**: `Error` \| `undefined`

Defined in: packages/node/dist/index.d.ts:354

Error if any

***

### id

> **id**: [`Hex`](Hex.md)

Defined in: packages/node/dist/index.d.ts:321

Id of the filter

***

### installed

> **installed**: `object`

Defined in: packages/node/dist/index.d.ts:350

Not sure what this is yet

***

### logs

> **logs**: [`FilterLog`](../../node/type-aliases/FilterLog.md)[]

Defined in: packages/node/dist/index.d.ts:338

Stores logs

***

### logsCriteria?

> `optional` **logsCriteria**: `TODO`

Defined in: packages/node/dist/index.d.ts:334

Criteria of the logs
https://github.com/ethereum/go-ethereum/blob/master/eth/filters/filter_system.go#L329

***

### registeredListeners

> **registeredListeners**: (...`args`) => `any`[]

Defined in: packages/node/dist/index.d.ts:358

Listeners registered for the filter

#### Parameters

##### args

...`any`[]

#### Returns

`any`

***

### tx

> **tx**: [`TypedTransaction`](../../tx/type-aliases/TypedTransaction.md)[]

Defined in: packages/node/dist/index.d.ts:342

stores tx

***

### type

> **type**: [`FilterType`](FilterType.md)

Defined in: packages/node/dist/index.d.ts:325

The type of the filter
