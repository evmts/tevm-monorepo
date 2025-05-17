[**@tevm/node**](../README.md)

***

[@tevm/node](../globals.md) / Filter

# Type Alias: Filter

> **Filter** = `object`

Defined in: [packages/node/src/Filter.ts:14](https://github.com/evmts/tevm-monorepo/blob/main/packages/node/src/Filter.ts#L14)

Internal representation of a registered filter

## Properties

### blocks

> **blocks**: `Block`[]

Defined in: [packages/node/src/Filter.ts:43](https://github.com/evmts/tevm-monorepo/blob/main/packages/node/src/Filter.ts#L43)

Stores the blocks

***

### created

> **created**: `number`

Defined in: [packages/node/src/Filter.ts:26](https://github.com/evmts/tevm-monorepo/blob/main/packages/node/src/Filter.ts#L26)

Creation timestamp

***

### err

> **err**: `Error` \| `undefined`

Defined in: [packages/node/src/Filter.ts:51](https://github.com/evmts/tevm-monorepo/blob/main/packages/node/src/Filter.ts#L51)

Error if any

***

### id

> **id**: `Hex`

Defined in: [packages/node/src/Filter.ts:18](https://github.com/evmts/tevm-monorepo/blob/main/packages/node/src/Filter.ts#L18)

Id of the filter

***

### installed

> **installed**: `object`

Defined in: [packages/node/src/Filter.ts:47](https://github.com/evmts/tevm-monorepo/blob/main/packages/node/src/Filter.ts#L47)

Not sure what this is yet

***

### logs

> **logs**: `GetFilterLogsReturnType`\[`number`\][]

Defined in: [packages/node/src/Filter.ts:35](https://github.com/evmts/tevm-monorepo/blob/main/packages/node/src/Filter.ts#L35)

Stores logs

***

### logsCriteria?

> `optional` **logsCriteria**: `TODO`

Defined in: [packages/node/src/Filter.ts:31](https://github.com/evmts/tevm-monorepo/blob/main/packages/node/src/Filter.ts#L31)

Criteria of the logs
https://github.com/ethereum/go-ethereum/blob/master/eth/filters/filter_system.go#L329

***

### registeredListeners

> **registeredListeners**: (...`args`) => `any`[]

Defined in: [packages/node/src/Filter.ts:55](https://github.com/evmts/tevm-monorepo/blob/main/packages/node/src/Filter.ts#L55)

Listeners registered for the filter

#### Parameters

##### args

...`any`[]

#### Returns

`any`

***

### tx

> **tx**: `TypedTransaction`[]

Defined in: [packages/node/src/Filter.ts:39](https://github.com/evmts/tevm-monorepo/blob/main/packages/node/src/Filter.ts#L39)

stores tx

***

### type

> **type**: [`FilterType`](FilterType.md)

Defined in: [packages/node/src/Filter.ts:22](https://github.com/evmts/tevm-monorepo/blob/main/packages/node/src/Filter.ts#L22)

The type of the filter
