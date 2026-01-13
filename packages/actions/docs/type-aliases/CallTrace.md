[**@tevm/actions**](../README.md)

***

[@tevm/actions](../globals.md) / CallTrace

# Type Alias: CallTrace

> **CallTrace** = `object`

Defined in: [packages/actions/src/eth/EthResult.ts:504](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/eth/EthResult.ts#L504)

Call trace for V2 debugging

## Properties

### calls?

> `optional` **calls**: `CallTrace`[]

Defined in: [packages/actions/src/eth/EthResult.ts:544](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/eth/EthResult.ts#L544)

Sub-calls made during this call

***

### error?

> `optional` **error**: `string`

Defined in: [packages/actions/src/eth/EthResult.ts:540](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/eth/EthResult.ts#L540)

Error message if the call failed

***

### from

> **from**: [`Address`](Address.md)

Defined in: [packages/actions/src/eth/EthResult.ts:512](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/eth/EthResult.ts#L512)

The sender address

***

### gas

> **gas**: `bigint`

Defined in: [packages/actions/src/eth/EthResult.ts:524](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/eth/EthResult.ts#L524)

The gas provided

***

### gasUsed

> **gasUsed**: `bigint`

Defined in: [packages/actions/src/eth/EthResult.ts:528](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/eth/EthResult.ts#L528)

The gas used

***

### input

> **input**: [`Hex`](Hex.md)

Defined in: [packages/actions/src/eth/EthResult.ts:532](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/eth/EthResult.ts#L532)

The input data

***

### output

> **output**: [`Hex`](Hex.md)

Defined in: [packages/actions/src/eth/EthResult.ts:536](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/eth/EthResult.ts#L536)

The output/return data

***

### to?

> `optional` **to**: [`Address`](Address.md)

Defined in: [packages/actions/src/eth/EthResult.ts:516](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/eth/EthResult.ts#L516)

The recipient address (or created contract address)

***

### type

> **type**: `string`

Defined in: [packages/actions/src/eth/EthResult.ts:508](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/eth/EthResult.ts#L508)

The type of call (CALL, DELEGATECALL, STATICCALL, CREATE, CREATE2)

***

### value?

> `optional` **value**: `bigint`

Defined in: [packages/actions/src/eth/EthResult.ts:520](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/eth/EthResult.ts#L520)

The value transferred
