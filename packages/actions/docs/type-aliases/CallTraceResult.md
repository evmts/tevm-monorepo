[**@tevm/actions**](../README.md)

***

[@tevm/actions](../globals.md) / CallTraceResult

# Type Alias: CallTraceResult

> **CallTraceResult** = `object`

Defined in: [packages/actions/src/common/CallTraceResult.ts:7](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/common/CallTraceResult.ts#L7)

Result from `debug_*` with `callTracer`

## Properties

| Property | Type | Defined in |
| ------ | ------ | ------ |
| <a id="calls"></a> `calls?` | [`TraceCall`](TraceCall.md)[] | [packages/actions/src/common/CallTraceResult.ts:16](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/common/CallTraceResult.ts#L16) |
| <a id="from"></a> `from` | [`Address`](Address.md) | [packages/actions/src/common/CallTraceResult.ts:9](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/common/CallTraceResult.ts#L9) |
| <a id="gas"></a> `gas` | `bigint` | [packages/actions/src/common/CallTraceResult.ts:12](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/common/CallTraceResult.ts#L12) |
| <a id="gasused"></a> `gasUsed` | `bigint` | [packages/actions/src/common/CallTraceResult.ts:13](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/common/CallTraceResult.ts#L13) |
| <a id="input"></a> `input` | [`Hex`](Hex.md) | [packages/actions/src/common/CallTraceResult.ts:14](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/common/CallTraceResult.ts#L14) |
| <a id="output"></a> `output` | [`Hex`](Hex.md) | [packages/actions/src/common/CallTraceResult.ts:15](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/common/CallTraceResult.ts#L15) |
| <a id="to"></a> `to` | [`Address`](Address.md) | [packages/actions/src/common/CallTraceResult.ts:10](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/common/CallTraceResult.ts#L10) |
| <a id="type"></a> `type` | [`TraceType`](TraceType.md) | [packages/actions/src/common/CallTraceResult.ts:8](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/common/CallTraceResult.ts#L8) |
| <a id="value"></a> `value` | `bigint` | [packages/actions/src/common/CallTraceResult.ts:11](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/common/CallTraceResult.ts#L11) |
