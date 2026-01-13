[**tevm**](../../README.md)

***

[tevm](../../modules.md) / [actions](../README.md) / CallTraceStep

# Type Alias: CallTraceStep

> **CallTraceStep** = `object`

Defined in: packages/actions/types/eth/EthResult.d.ts:353

A single call trace step for V2 debugging

## Properties

### depth

> **depth**: `number`

Defined in: packages/actions/types/eth/EthResult.d.ts:373

The current depth of the call stack

***

### gas

> **gas**: `bigint`

Defined in: packages/actions/types/eth/EthResult.d.ts:365

The gas remaining

***

### gasCost

> **gasCost**: `bigint`

Defined in: packages/actions/types/eth/EthResult.d.ts:369

The gas cost of this operation

***

### memory?

> `optional` **memory**: [`Hex`](Hex.md)

Defined in: packages/actions/types/eth/EthResult.d.ts:381

The memory contents (if requested)

***

### op

> **op**: `string`

Defined in: packages/actions/types/eth/EthResult.d.ts:357

The opcode executed

***

### pc

> **pc**: `number`

Defined in: packages/actions/types/eth/EthResult.d.ts:361

The program counter

***

### stack?

> `optional` **stack**: [`Hex`](Hex.md)[]

Defined in: packages/actions/types/eth/EthResult.d.ts:377

The stack contents (top items)
