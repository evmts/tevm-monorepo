[**@tevm/actions**](../README.md)

***

[@tevm/actions](../globals.md) / CallTraceStep

# Type Alias: CallTraceStep

> **CallTraceStep** = `object`

Defined in: [packages/actions/src/eth/EthResult.ts:452](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/eth/EthResult.ts#L452)

A single call trace step for V2 debugging

## Properties

| Property | Type | Description | Defined in |
| ------ | ------ | ------ | ------ |
| <a id="depth"></a> `depth` | `number` | The current depth of the call stack | [packages/actions/src/eth/EthResult.ts:472](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/eth/EthResult.ts#L472) |
| <a id="gas"></a> `gas` | `bigint` | The gas remaining | [packages/actions/src/eth/EthResult.ts:464](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/eth/EthResult.ts#L464) |
| <a id="gascost"></a> `gasCost` | `bigint` | The gas cost of this operation | [packages/actions/src/eth/EthResult.ts:468](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/eth/EthResult.ts#L468) |
| <a id="memory"></a> `memory?` | [`Hex`](Hex.md) | The memory contents (if requested) | [packages/actions/src/eth/EthResult.ts:480](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/eth/EthResult.ts#L480) |
| <a id="op"></a> `op` | `string` | The opcode executed | [packages/actions/src/eth/EthResult.ts:456](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/eth/EthResult.ts#L456) |
| <a id="pc"></a> `pc` | `number` | The program counter | [packages/actions/src/eth/EthResult.ts:460](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/eth/EthResult.ts#L460) |
| <a id="stack"></a> `stack?` | [`Hex`](Hex.md)[] | The stack contents (top items) | [packages/actions/src/eth/EthResult.ts:476](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/eth/EthResult.ts#L476) |
