[**@tevm/actions**](../README.md)

***

[@tevm/actions](../globals.md) / MuxTraceResult

# Type Alias: MuxTraceResult\<TTracers, TDiffMode\>

> **MuxTraceResult**\<`TTracers`, `TDiffMode`\> = `{ [K in TTracers[number]]?: K extends keyof TracerResultMap<TDiffMode> ? TracerResultMap<TDiffMode>[K] : never }`

Defined in: [packages/actions/src/common/MuxTraceResult.ts:66](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/common/MuxTraceResult.ts#L66)

Result from `debug_*` with `muxTracer`

The muxTracer multiplexes multiple tracers and returns their results in a single object.
Each key in the result corresponds to a tracer name, and the value is that tracer's output.

## Type Parameters

### TTracers

`TTracers` *extends* readonly [`MuxTracerType`](MuxTracerType.md)[] = readonly [`MuxTracerType`](MuxTracerType.md)[]

### TDiffMode

`TDiffMode` *extends* `boolean` = `boolean`

## Example

```typescript
// Request with muxTracer
const result = await client.request({
  method: 'debug_traceCall',
  params: [{
    from: '0x...',
    to: '0x...',
    data: '0x...'
  }, 'latest', {
    tracer: 'muxTracer',
    tracerConfig: {
      callTracer: {},
      '4byteTracer': {},
      prestateTracer: { diffMode: true }
    }
  }]
})

// Result structure
{
  callTracer: { type: 'CALL', from: '0x...', to: '0x...', ... },
  '4byteTracer': { '0x12345678-32': 1, ... },
  prestateTracer: { pre: {...}, post: {...} }
}
```
