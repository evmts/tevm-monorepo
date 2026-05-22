[**@tevm/actions**](../README.md)

***

[@tevm/actions](../globals.md) / anvilSetNextBlockBaseFeePerGasJsonRpcProcedure

# Function: anvilSetNextBlockBaseFeePerGasJsonRpcProcedure()

> **anvilSetNextBlockBaseFeePerGasJsonRpcProcedure**(`client`): [`AnvilSetNextBlockBaseFeePerGasProcedure`](../type-aliases/AnvilSetNextBlockBaseFeePerGasProcedure.md)

Defined in: [packages/actions/src/anvil/anvilSetNextBlockBaseFeePerGasProcedure.js:9](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/anvil/anvilSetNextBlockBaseFeePerGasProcedure.js#L9)

Request handler for anvil_setNextBlockBaseFeePerGas JSON-RPC requests.
Sets the base fee per gas for the next block only (EIP-1559).
After the next block is mined, the base fee will revert to being calculated automatically.

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `client` | `TevmNode`\<`"fork"` \| `"normal"`, \{ \}\> | - |

## Returns

[`AnvilSetNextBlockBaseFeePerGasProcedure`](../type-aliases/AnvilSetNextBlockBaseFeePerGasProcedure.md)
