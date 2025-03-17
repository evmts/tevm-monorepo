[**@tevm/actions**](../README.md)

***

[@tevm/actions](../globals.md) / ethSimulateV1Handler

# Function: ethSimulateV1Handler()

> **ethSimulateV1Handler**(`client`): (`params`) => `Promise`\<[`SimulateResult`](../interfaces/SimulateResult.md)\>

Defined in: [packages/actions/src/eth/ethSimulateV1Handler.js:39](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/eth/ethSimulateV1Handler.js#L39)

Handler for the eth_simulateV1 method, which simulates a series of transactions
at a specific block height with optional state overrides

## Parameters

### client

`TevmNode`\<`"fork"` \| `"normal"`, \{\}\>

Tevm node client

## Returns

`Function`

### Parameters

#### params

[`SimulateParams`](../interfaces/SimulateParams.md)

### Returns

`Promise`\<[`SimulateResult`](../interfaces/SimulateResult.md)\>
