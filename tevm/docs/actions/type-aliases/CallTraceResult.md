[**tevm**](../../README.md)

***

[tevm](../../modules.md) / [actions](../README.md) / CallTraceResult

# Type Alias: CallTraceResult

> **CallTraceResult** = `object`

Result from `debug_*` with `callTracer`

## Properties

| Property | Type |
| ------ | ------ |
| <a id="calls"></a> `calls?` | [`TraceCall`](../../index/type-aliases/TraceCall.md)[] |
| <a id="from"></a> `from` | [`Address`](Address.md) |
| <a id="gas"></a> `gas` | `bigint` |
| <a id="gasused"></a> `gasUsed` | `bigint` |
| <a id="input"></a> `input` | [`Hex`](Hex.md) |
| <a id="output"></a> `output` | [`Hex`](Hex.md) |
| <a id="to"></a> `to` | [`Address`](Address.md) |
| <a id="type"></a> `type` | [`TraceType`](TraceType.md) |
| <a id="value"></a> `value` | `bigint` |
