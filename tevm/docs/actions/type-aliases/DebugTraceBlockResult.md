[**tevm**](../../README.md)

***

[tevm](../../modules.md) / [actions](../README.md) / DebugTraceBlockResult

# Type Alias: DebugTraceBlockResult

> **DebugTraceBlockResult**: `object`[]

Defined in: packages/actions/types/debug/DebugResult.d.ts:26

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
