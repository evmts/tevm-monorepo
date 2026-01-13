[**@tevm/actions**](../README.md)

***

[@tevm/actions](../globals.md) / EthSimulateV1Params

# Type Alias: EthSimulateV1Params

> **EthSimulateV1Params** = `object`

Defined in: [packages/actions/src/eth/EthParams.ts:452](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/eth/EthParams.ts#L452)

Based on the JSON-RPC request for `eth_simulateV1` procedure
Allows simulation of multiple transactions across multiple blocks with state overrides

## Properties

### blockStateCalls

> `readonly` **blockStateCalls**: readonly [`EthSimulateV1BlockStateCall`](EthSimulateV1BlockStateCall.md)[]

Defined in: [packages/actions/src/eth/EthParams.ts:457](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/eth/EthParams.ts#L457)

Array of block state calls to simulate. Each block can have its own
state overrides and multiple calls.

***

### blockTag?

> `readonly` `optional` **blockTag**: [`BlockParam`](BlockParam.md)

Defined in: [packages/actions/src/eth/EthParams.ts:473](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/eth/EthParams.ts#L473)

The block number or tag to execute the simulation against

***

### returnFullTransactions?

> `readonly` `optional` **returnFullTransactions**: `boolean`

Defined in: [packages/actions/src/eth/EthParams.ts:469](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/eth/EthParams.ts#L469)

Whether to return full transaction objects in the response

***

### traceTransfers?

> `readonly` `optional` **traceTransfers**: `boolean`

Defined in: [packages/actions/src/eth/EthParams.ts:461](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/eth/EthParams.ts#L461)

Whether to trace ETH transfers

***

### validation?

> `readonly` `optional` **validation**: `boolean`

Defined in: [packages/actions/src/eth/EthParams.ts:465](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/eth/EthParams.ts#L465)

Whether to validate transactions (check signatures, nonces, etc.)
