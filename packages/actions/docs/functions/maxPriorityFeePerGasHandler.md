[**@tevm/actions**](../README.md)

***

[@tevm/actions](../globals.md) / maxPriorityFeePerGasHandler

# Function: maxPriorityFeePerGasHandler()

> **maxPriorityFeePerGasHandler**(`client`): [`EthMaxPriorityFeePerGasHandler`](../type-aliases/EthMaxPriorityFeePerGasHandler.md)

Defined in: [packages/actions/src/eth/maxPriorityFeePerGasHandler.js:11](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/eth/maxPriorityFeePerGasHandler.js#L11)

Handler for the `eth_maxPriorityFeePerGas` RPC method.
Returns the current maximum priority fee per gas (tip).

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `client` | `TevmNode`\<`"fork"` \| `"normal"`, \{ \}\> | - |

## Returns

[`EthMaxPriorityFeePerGasHandler`](../type-aliases/EthMaxPriorityFeePerGasHandler.md)
