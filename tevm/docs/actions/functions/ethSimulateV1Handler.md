[**tevm**](../../README.md)

***

[tevm](../../modules.md) / [actions](../README.md) / ethSimulateV1Handler

# Function: ethSimulateV1Handler()

> **ethSimulateV1Handler**(`client`): (`params`) => `Promise`\<[`SimulateResult`](../type-aliases/SimulateResult.md)\>

Defined in: packages/actions/types/eth/ethSimulateV1Handler.d.ts:26

Handler for the eth_simulateV1 method, which simulates a series of transactions
at a specific block height with optional state overrides

## Parameters

### client

[`TevmNode`](../../index/type-aliases/TevmNode.md)\<`"fork"` \| `"normal"`, \{\}\>

## Returns

`Function`

### Parameters

#### params

[`SimulateParams`](../type-aliases/SimulateParams.md)

### Returns

`Promise`\<[`SimulateResult`](../type-aliases/SimulateResult.md)\>
