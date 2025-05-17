[**tevm**](../../README.md)

***

[tevm](../../modules.md) / [index](../README.md) / Filter

# Type Alias: Filter

> **Filter** = `object`

Defined in: packages/node/dist/index.d.ts:62

Internal representation of a registered filter

## Properties

### blocks

> **blocks**: [`Block`](../../block/classes/Block.md)[]

Defined in: packages/node/dist/index.d.ts:91

Stores the blocks

***

### created

> **created**: `number`

Defined in: packages/node/dist/index.d.ts:74

Creation timestamp

***

### err

> **err**: `Error` \| `undefined`

Defined in: packages/node/dist/index.d.ts:99

Error if any

***

### id

> **id**: [`Hex`](Hex.md)

Defined in: packages/node/dist/index.d.ts:66

Id of the filter

***

### installed

> **installed**: `object`

Defined in: packages/node/dist/index.d.ts:95

Not sure what this is yet

***

### logs

> **logs**: `GetFilterLogsReturnType`\[`number`\][]

Defined in: packages/node/dist/index.d.ts:83

Stores logs

***

### logsCriteria?

> `optional` **logsCriteria**: `TODO`

Defined in: packages/node/dist/index.d.ts:79

Criteria of the logs
https://github.com/ethereum/go-ethereum/blob/master/eth/filters/filter_system.go#L329

***

### registeredListeners

> **registeredListeners**: (...`args`) => `any`[]

Defined in: packages/node/dist/index.d.ts:103

Listeners registered for the filter

#### Parameters

##### args

...`any`[]

#### Returns

`any`

***

### tx

> **tx**: [`TypedTransaction`](../../tx/type-aliases/TypedTransaction.md)[]

Defined in: packages/node/dist/index.d.ts:87

stores tx

***

### type

> **type**: [`FilterType`](FilterType.md)

Defined in: packages/node/dist/index.d.ts:70

The type of the filter
