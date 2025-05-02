[**tevm**](../../README.md)

***

[tevm](../../modules.md) / [actions](../README.md) / CallTraceResult

# Type Alias: CallTraceResult

> **CallTraceResult**: `object`

Defined in: packages/actions/types/common/CallTraceResult.d.ts:6

Result from `debug_*` with `callTracer`

## Type declaration

### calls?

> `optional` **calls**: [`TraceCall`](../../index/type-aliases/TraceCall.md)[]

### from

> **from**: [`Address`](Address.md)

### gas

> **gas**: `bigint`

### gasUsed

> **gasUsed**: `bigint`

### input

> **input**: [`Hex`](Hex.md)

### output

> **output**: [`Hex`](Hex.md)

### to

> **to**: [`Address`](Address.md)

### type

> **type**: [`TraceType`](TraceType.md)

### value

> **value**: `bigint`
