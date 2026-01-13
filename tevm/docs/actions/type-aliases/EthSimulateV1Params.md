[**tevm**](../../README.md)

***

[tevm](../../modules.md) / [actions](../README.md) / EthSimulateV1Params

# Type Alias: EthSimulateV1Params

> **EthSimulateV1Params** = `object`

Defined in: packages/actions/types/eth/EthParams.d.ts:424

Based on the JSON-RPC request for `eth_simulateV1` procedure
Allows simulation of multiple transactions across multiple blocks with state overrides

## Properties

### blockStateCalls

> `readonly` **blockStateCalls**: readonly [`EthSimulateV1BlockStateCall`](EthSimulateV1BlockStateCall.md)[]

Defined in: packages/actions/types/eth/EthParams.d.ts:429

Array of block state calls to simulate. Each block can have its own
state overrides and multiple calls.

***

### blockTag?

> `readonly` `optional` **blockTag**: [`BlockParam`](../../index/type-aliases/BlockParam.md)

Defined in: packages/actions/types/eth/EthParams.d.ts:445

The block number or tag to execute the simulation against

***

### returnFullTransactions?

> `readonly` `optional` **returnFullTransactions**: `boolean`

Defined in: packages/actions/types/eth/EthParams.d.ts:441

Whether to return full transaction objects in the response

***

### traceTransfers?

> `readonly` `optional` **traceTransfers**: `boolean`

Defined in: packages/actions/types/eth/EthParams.d.ts:433

Whether to trace ETH transfers

***

### validation?

> `readonly` `optional` **validation**: `boolean`

Defined in: packages/actions/types/eth/EthParams.d.ts:437

Whether to validate transactions (check signatures, nonces, etc.)
