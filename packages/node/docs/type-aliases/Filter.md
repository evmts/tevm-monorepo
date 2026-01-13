[**@tevm/node**](../README.md)

***

[@tevm/node](../globals.md) / Filter

# Type Alias: Filter

> **Filter** = `object`

Defined in: [packages/node/src/Filter.ts:56](https://github.com/evmts/tevm-monorepo/blob/main/packages/node/src/Filter.ts#L56)

Internal representation of a registered filter

## Properties

### blocks

> **blocks**: `Block`[]

Defined in: [packages/node/src/Filter.ts:85](https://github.com/evmts/tevm-monorepo/blob/main/packages/node/src/Filter.ts#L85)

Stores the blocks

***

### created

> **created**: `number`

Defined in: [packages/node/src/Filter.ts:68](https://github.com/evmts/tevm-monorepo/blob/main/packages/node/src/Filter.ts#L68)

Creation timestamp

***

### err

> **err**: `Error` \| `undefined`

Defined in: [packages/node/src/Filter.ts:93](https://github.com/evmts/tevm-monorepo/blob/main/packages/node/src/Filter.ts#L93)

Error if any

***

### id

> **id**: `Hex`

Defined in: [packages/node/src/Filter.ts:60](https://github.com/evmts/tevm-monorepo/blob/main/packages/node/src/Filter.ts#L60)

Id of the filter

***

### installed

> **installed**: `object`

Defined in: [packages/node/src/Filter.ts:89](https://github.com/evmts/tevm-monorepo/blob/main/packages/node/src/Filter.ts#L89)

Not sure what this is yet

***

### logs

> **logs**: [`FilterLog`](FilterLog.md)[]

Defined in: [packages/node/src/Filter.ts:77](https://github.com/evmts/tevm-monorepo/blob/main/packages/node/src/Filter.ts#L77)

Stores logs

***

### logsCriteria?

> `optional` **logsCriteria**: `TODO`

Defined in: [packages/node/src/Filter.ts:73](https://github.com/evmts/tevm-monorepo/blob/main/packages/node/src/Filter.ts#L73)

Criteria of the logs
https://github.com/ethereum/go-ethereum/blob/master/eth/filters/filter_system.go#L329

***

### registeredListeners

> **registeredListeners**: (...`args`) => `any`[]

Defined in: [packages/node/src/Filter.ts:97](https://github.com/evmts/tevm-monorepo/blob/main/packages/node/src/Filter.ts#L97)

Listeners registered for the filter

#### Parameters

##### args

...`any`[]

#### Returns

`any`

***

### tx

> **tx**: `TypedTransaction`[]

Defined in: [packages/node/src/Filter.ts:81](https://github.com/evmts/tevm-monorepo/blob/main/packages/node/src/Filter.ts#L81)

stores tx

***

### type

> **type**: [`FilterType`](FilterType.md)

Defined in: [packages/node/src/Filter.ts:64](https://github.com/evmts/tevm-monorepo/blob/main/packages/node/src/Filter.ts#L64)

The type of the filter
