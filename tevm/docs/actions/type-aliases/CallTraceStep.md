[**tevm**](../../README.md)

***

[tevm](../../modules.md) / [actions](../README.md) / CallTraceStep

# Type Alias: CallTraceStep

> **CallTraceStep** = `object`

A single call trace step for V2 debugging

## Properties

| Property | Type | Description |
| ------ | ------ | ------ |
| <a id="depth"></a> `depth` | `number` | The current depth of the call stack |
| <a id="gas"></a> `gas` | `bigint` | The gas remaining |
| <a id="gascost"></a> `gasCost` | `bigint` | The gas cost of this operation |
| <a id="memory"></a> `memory?` | [`Hex`](Hex.md) | The memory contents (if requested) |
| <a id="op"></a> `op` | `string` | The opcode executed |
| <a id="pc"></a> `pc` | `number` | The program counter |
| <a id="stack"></a> `stack?` | [`Hex`](Hex.md)[] | The stack contents (top items) |
