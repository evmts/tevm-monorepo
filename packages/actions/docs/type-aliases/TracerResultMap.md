[**@tevm/actions**](../README.md)

***

[@tevm/actions](../globals.md) / TracerResultMap

# Type Alias: TracerResultMap\<TDiffMode\>

> **TracerResultMap**\<`TDiffMode`\> = `object`

Defined in: [packages/actions/src/common/MuxTraceResult.ts:15](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/common/MuxTraceResult.ts#L15)

Maps tracer type to its result type

## Type Parameters

### TDiffMode

`TDiffMode` *extends* `boolean` = `boolean`

## Properties

### 4byteTracer

> **4byteTracer**: [`FourbyteTraceResult`](FourbyteTraceResult.md)

Defined in: [packages/actions/src/common/MuxTraceResult.ts:18](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/common/MuxTraceResult.ts#L18)

***

### callTracer

> **callTracer**: [`CallTraceResult`](CallTraceResult.md)

Defined in: [packages/actions/src/common/MuxTraceResult.ts:16](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/common/MuxTraceResult.ts#L16)

***

### default

> **default**: [`TraceResult`](TraceResult.md)

Defined in: [packages/actions/src/common/MuxTraceResult.ts:20](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/common/MuxTraceResult.ts#L20)

***

### flatCallTracer

> **flatCallTracer**: [`FlatCallTraceResult`](FlatCallTraceResult.md)

Defined in: [packages/actions/src/common/MuxTraceResult.ts:19](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/common/MuxTraceResult.ts#L19)

***

### prestateTracer

> **prestateTracer**: [`PrestateTraceResult`](PrestateTraceResult.md)\<`TDiffMode`\>

Defined in: [packages/actions/src/common/MuxTraceResult.ts:17](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/common/MuxTraceResult.ts#L17)
