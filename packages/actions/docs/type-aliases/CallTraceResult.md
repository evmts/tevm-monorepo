[**@tevm/actions**](../README.md)

***

[@tevm/actions](../globals.md) / CallTraceResult

# Type Alias: CallTraceResult

> **CallTraceResult** = `object`

Defined in: [packages/actions/src/common/CallTraceResult.ts:7](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/common/CallTraceResult.ts#L7)

Result from `debug_*` with `callTracer`

## Properties

### calls?

> `optional` **calls**: [`TraceCall`](TraceCall.md)[]

Defined in: [packages/actions/src/common/CallTraceResult.ts:16](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/common/CallTraceResult.ts#L16)

***

### from

> **from**: [`Address`](Address.md)

Defined in: [packages/actions/src/common/CallTraceResult.ts:9](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/common/CallTraceResult.ts#L9)

***

### gas

> **gas**: `bigint`

Defined in: [packages/actions/src/common/CallTraceResult.ts:12](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/common/CallTraceResult.ts#L12)

***

### gasUsed

> **gasUsed**: `bigint`

Defined in: [packages/actions/src/common/CallTraceResult.ts:13](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/common/CallTraceResult.ts#L13)

***

### input

> **input**: [`Hex`](Hex.md)

Defined in: [packages/actions/src/common/CallTraceResult.ts:14](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/common/CallTraceResult.ts#L14)

***

### output

> **output**: [`Hex`](Hex.md)

Defined in: [packages/actions/src/common/CallTraceResult.ts:15](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/common/CallTraceResult.ts#L15)

***

### to

> **to**: [`Address`](Address.md)

Defined in: [packages/actions/src/common/CallTraceResult.ts:10](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/common/CallTraceResult.ts#L10)

***

### type

> **type**: [`TraceType`](TraceType.md)

Defined in: [packages/actions/src/common/CallTraceResult.ts:8](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/common/CallTraceResult.ts#L8)

***

### value

> **value**: `bigint`

Defined in: [packages/actions/src/common/CallTraceResult.ts:11](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/common/CallTraceResult.ts#L11)
