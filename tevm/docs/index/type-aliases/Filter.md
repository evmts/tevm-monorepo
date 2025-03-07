[**tevm**](../../README.md)

***

[tevm](../../modules.md) / [index](../README.md) / Filter

# Type Alias: Filter

> **Filter**: `object`

Defined in: packages/node/dist/index.d.ts:62

Internal representation of a registered filter

## Type declaration

### blocks

> **blocks**: [`Block`](../../block/classes/Block.md)[]

Stores the blocks

### created

> **created**: `number`

Creation timestamp

### err

> **err**: `Error` \| `undefined`

Error if any

### id

> **id**: [`Hex`](Hex.md)

Id of the filter

### installed

> **installed**: `object`

Not sure what this is yet

### logs

> **logs**: `GetFilterLogsReturnType`\[`number`\][]

Stores logs

### logsCriteria?

> `optional` **logsCriteria**: `TODO`

Criteria of the logs
https://github.com/ethereum/go-ethereum/blob/master/eth/filters/filter_system.go#L329

### registeredListeners

> **registeredListeners**: (...`args`) => `any`[]

Listeners registered for the filter

#### Parameters

##### args

...`any`[]

#### Returns

`any`

### tx

> **tx**: [`TypedTransaction`](../../tx/type-aliases/TypedTransaction.md)[]

stores tx

### type

> **type**: [`FilterType`](FilterType.md)

The type of the filter
