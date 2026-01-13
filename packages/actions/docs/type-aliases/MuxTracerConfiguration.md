[**@tevm/actions**](../README.md)

***

[@tevm/actions](../globals.md) / MuxTracerConfiguration

# Type Alias: MuxTracerConfiguration\<TDiffMode\>

> **MuxTracerConfiguration**\<`TDiffMode`\> = `object`

Defined in: [packages/actions/src/common/MuxTraceResult.ts:77](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/common/MuxTraceResult.ts#L77)

Configuration for muxTracer
Each key is a tracer name and the value is that tracer's specific config

## Type Parameters

### TDiffMode

`TDiffMode` *extends* `boolean` = `boolean`

## Properties

### 4byteTracer?

> `optional` **4byteTracer**: `Record`\<`string`, `never`\> \| \{ \}

Defined in: [packages/actions/src/common/MuxTraceResult.ts:80](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/common/MuxTraceResult.ts#L80)

***

### callTracer?

> `optional` **callTracer**: `Record`\<`string`, `never`\> \| \{ \}

Defined in: [packages/actions/src/common/MuxTraceResult.ts:78](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/common/MuxTraceResult.ts#L78)

***

### default?

> `optional` **default**: `Record`\<`string`, `never`\> \| \{ \}

Defined in: [packages/actions/src/common/MuxTraceResult.ts:82](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/common/MuxTraceResult.ts#L82)

***

### flatCallTracer?

> `optional` **flatCallTracer**: `Record`\<`string`, `never`\> \| \{ \}

Defined in: [packages/actions/src/common/MuxTraceResult.ts:81](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/common/MuxTraceResult.ts#L81)

***

### prestateTracer?

> `optional` **prestateTracer**: `object`

Defined in: [packages/actions/src/common/MuxTraceResult.ts:79](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/common/MuxTraceResult.ts#L79)

#### diffMode?

> `optional` **diffMode**: `TDiffMode`
