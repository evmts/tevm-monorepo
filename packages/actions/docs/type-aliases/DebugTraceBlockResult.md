[**@tevm/actions**](../README.md)

***

[@tevm/actions](../globals.md) / DebugTraceBlockResult

# Type Alias: DebugTraceBlockResult

> **DebugTraceBlockResult**: `object`[]

Defined in: [packages/actions/src/debug/DebugResult.ts:32](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/debug/DebugResult.ts#L32)

Result type for `debug_traceBlock`
Returns a full stack trace of all invoked opcodes of all transactions that were included in a block

## Type declaration

### calls?

> `optional` **calls**: [`DebugTraceBlockResult`](DebugTraceBlockResult.md)\[`0`\][]

### from

> **from**: [`Hex`](Hex.md)

### gas

> **gas**: `bigint`

### gasUsed

> **gasUsed**: `bigint`

### input

> **input**: [`Hex`](Hex.md)

### output

> **output**: [`Hex`](Hex.md)

### to

> **to**: [`Hex`](Hex.md)

### type

> **type**: `string`

### value

> **value**: `bigint`
