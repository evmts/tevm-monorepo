[**tevm**](../../README.md)

***

[tevm](../../modules.md) / [actions](../README.md) / CallTraceResult

# Type Alias: CallTraceResult

> **CallTraceResult** = `object`

Defined in: tevm-monorepo/packages/actions/types/common/CallTraceResult.d.ts:6

Result from `debug_*` with `callTracer`

## Properties

### calls?

> `optional` **calls?**: [`TraceCall`](../../index/type-aliases/TraceCall.md)[]

Defined in: tevm-monorepo/packages/actions/types/common/CallTraceResult.d.ts:15

***

### from

> **from**: [`Address`](Address.md)

Defined in: tevm-monorepo/packages/actions/types/common/CallTraceResult.d.ts:8

***

### gas

> **gas**: `bigint`

Defined in: tevm-monorepo/packages/actions/types/common/CallTraceResult.d.ts:11

***

### gasUsed

> **gasUsed**: `bigint`

Defined in: tevm-monorepo/packages/actions/types/common/CallTraceResult.d.ts:12

***

### input

> **input**: [`Hex`](Hex.md)

Defined in: tevm-monorepo/packages/actions/types/common/CallTraceResult.d.ts:13

***

### output

> **output**: [`Hex`](Hex.md)

Defined in: tevm-monorepo/packages/actions/types/common/CallTraceResult.d.ts:14

***

### to

> **to**: [`Address`](Address.md)

Defined in: tevm-monorepo/packages/actions/types/common/CallTraceResult.d.ts:9

***

### type

> **type**: [`TraceType`](TraceType.md)

Defined in: tevm-monorepo/packages/actions/types/common/CallTraceResult.d.ts:7

***

### value

> **value**: `bigint`

Defined in: tevm-monorepo/packages/actions/types/common/CallTraceResult.d.ts:10
