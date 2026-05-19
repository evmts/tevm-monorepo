[**tevm**](../../README.md)

***

[tevm](../../modules.md) / [index](../README.md) / Filter

# Type Alias: Filter

> **Filter** = `object`

Defined in: tevm-monorepo/packages/node/dist/index.d.ts:311

Internal representation of a registered filter

## Properties

### blocks

> **blocks**: [`Block`](../../block/classes/Block.md)[]

Defined in: tevm-monorepo/packages/node/dist/index.d.ts:340

Stores the blocks

***

### created

> **created**: `number`

Defined in: tevm-monorepo/packages/node/dist/index.d.ts:323

Creation timestamp

***

### err

> **err**: `Error` \| `undefined`

Defined in: tevm-monorepo/packages/node/dist/index.d.ts:348

Error if any

***

### id

> **id**: [`Hex`](Hex.md)

Defined in: tevm-monorepo/packages/node/dist/index.d.ts:315

Id of the filter

***

### installed

> **installed**: `object`

Defined in: tevm-monorepo/packages/node/dist/index.d.ts:344

Not sure what this is yet

***

### logs

> **logs**: [`FilterLog`](../../node/type-aliases/FilterLog.md)[]

Defined in: tevm-monorepo/packages/node/dist/index.d.ts:332

Stores logs

***

### logsCriteria?

> `optional` **logsCriteria?**: `TODO`

Defined in: tevm-monorepo/packages/node/dist/index.d.ts:328

Criteria of the logs
https://github.com/ethereum/go-ethereum/blob/master/eth/filters/filter_system.go#L329

***

### registeredListeners

> **registeredListeners**: (...`args`) => `any`[]

Defined in: tevm-monorepo/packages/node/dist/index.d.ts:352

Listeners registered for the filter

#### Parameters

##### args

...`any`[]

#### Returns

`any`

***

### tx

> **tx**: [`TypedTransaction`](../../tx/type-aliases/TypedTransaction.md)[]

Defined in: tevm-monorepo/packages/node/dist/index.d.ts:336

stores tx

***

### type

> **type**: [`FilterType`](FilterType.md)

Defined in: tevm-monorepo/packages/node/dist/index.d.ts:319

The type of the filter
