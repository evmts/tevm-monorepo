[**@tevm/actions**](../README.md)

***

[@tevm/actions](../globals.md) / CallTraceStep

# Type Alias: CallTraceStep

> **CallTraceStep** = `object`

Defined in: [packages/actions/src/eth/EthResult.ts:452](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/eth/EthResult.ts#L452)

A single call trace step for V2 debugging

## Properties

### depth

> **depth**: `number`

Defined in: [packages/actions/src/eth/EthResult.ts:472](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/eth/EthResult.ts#L472)

The current depth of the call stack

***

### gas

> **gas**: `bigint`

Defined in: [packages/actions/src/eth/EthResult.ts:464](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/eth/EthResult.ts#L464)

The gas remaining

***

### gasCost

> **gasCost**: `bigint`

Defined in: [packages/actions/src/eth/EthResult.ts:468](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/eth/EthResult.ts#L468)

The gas cost of this operation

***

### memory?

> `optional` **memory**: [`Hex`](Hex.md)

Defined in: [packages/actions/src/eth/EthResult.ts:480](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/eth/EthResult.ts#L480)

The memory contents (if requested)

***

### op

> **op**: `string`

Defined in: [packages/actions/src/eth/EthResult.ts:456](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/eth/EthResult.ts#L456)

The opcode executed

***

### pc

> **pc**: `number`

Defined in: [packages/actions/src/eth/EthResult.ts:460](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/eth/EthResult.ts#L460)

The program counter

***

### stack?

> `optional` **stack**: [`Hex`](Hex.md)[]

Defined in: [packages/actions/src/eth/EthResult.ts:476](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/eth/EthResult.ts#L476)

The stack contents (top items)
