[**tevm**](../../README.md)

***

[tevm](../../modules.md) / [actions](../README.md) / MuxTracerConfiguration

# Type Alias: MuxTracerConfiguration\<TDiffMode\>

> **MuxTracerConfiguration**\<`TDiffMode`\> = `object`

Defined in: packages/actions/types/common/MuxTraceResult.d.ts:77

Configuration for muxTracer
Each key is a tracer name and the value is that tracer's specific config

## Type Parameters

### TDiffMode

`TDiffMode` *extends* `boolean` = `boolean`

## Properties

### 4byteTracer?

> `optional` **4byteTracer**: `Record`\<`string`, `never`\> \| \{ \}

Defined in: packages/actions/types/common/MuxTraceResult.d.ts:82

***

### callTracer?

> `optional` **callTracer**: `Record`\<`string`, `never`\> \| \{ \}

Defined in: packages/actions/types/common/MuxTraceResult.d.ts:78

***

### default?

> `optional` **default**: `Record`\<`string`, `never`\> \| \{ \}

Defined in: packages/actions/types/common/MuxTraceResult.d.ts:84

***

### flatCallTracer?

> `optional` **flatCallTracer**: `Record`\<`string`, `never`\> \| \{ \}

Defined in: packages/actions/types/common/MuxTraceResult.d.ts:83

***

### prestateTracer?

> `optional` **prestateTracer**: `object`

Defined in: packages/actions/types/common/MuxTraceResult.d.ts:79

#### diffMode?

> `optional` **diffMode**: `TDiffMode`
