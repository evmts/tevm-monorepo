[**tevm**](../../README.md)

***

[tevm](../../modules.md) / [actions](../README.md) / EthSimulateV1Handler

# Type Alias: EthSimulateV1Handler()

> **EthSimulateV1Handler**: (`client`) => (`params`) => `Promise`\<[`SimulateResult`](SimulateResult.md)\>

Defined in: packages/actions/types/eth/ethSimulateV1HandlerType.d.ts:190

Handler for simulating a series of transactions with optional state overrides

## Parameters

### client

[`TevmNode`](../../index/type-aliases/TevmNode.md)

## Returns

`Function`

### Parameters

#### params

[`SimulateParams`](SimulateParams.md)

### Returns

`Promise`\<[`SimulateResult`](SimulateResult.md)\>
