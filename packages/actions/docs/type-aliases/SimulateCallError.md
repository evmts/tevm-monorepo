[**@tevm/actions**](../README.md)

***

[@tevm/actions](../globals.md) / SimulateCallError

# Type Alias: SimulateCallError

> **SimulateCallError** = `object`

Defined in: [packages/actions/src/eth/EthResult.ts:367](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/eth/EthResult.ts#L367)

Error information for a simulated call

## Properties

### code

> **code**: `number`

Defined in: [packages/actions/src/eth/EthResult.ts:371](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/eth/EthResult.ts#L371)

Error code

***

### data?

> `optional` **data**: [`Hex`](Hex.md)

Defined in: [packages/actions/src/eth/EthResult.ts:379](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/eth/EthResult.ts#L379)

Optional data (e.g., revert reason)

***

### message

> **message**: `string`

Defined in: [packages/actions/src/eth/EthResult.ts:375](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/eth/EthResult.ts#L375)

Error message
