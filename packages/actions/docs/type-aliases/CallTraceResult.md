[**@tevm/actions**](../README.md)

***

[@tevm/actions](../globals.md) / CallTraceResult

# Type Alias: CallTraceResult

> **CallTraceResult**: `object`

Defined in: [packages/actions/src/common/CallTraceResult.ts:7](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/common/CallTraceResult.ts#L7)

Result from `debug_*` with `callTracer`

## Type declaration

### calls?

> `optional` **calls**: [`TraceCall`](TraceCall.md)[]

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
