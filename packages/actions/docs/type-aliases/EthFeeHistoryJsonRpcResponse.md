[**@tevm/actions**](../README.md)

***

[@tevm/actions](../globals.md) / EthFeeHistoryJsonRpcResponse

# Type Alias: EthFeeHistoryJsonRpcResponse

> **EthFeeHistoryJsonRpcResponse** = `JsonRpcResponse`\<`"eth_feeHistory"`, \{ `baseFeePerGas`: `Hex`[]; `gasUsedRatio`: `number`[]; `oldestBlock`: `Hex`; `reward?`: `Hex`[][]; \}, `string` \| `number`\>

Defined in: [packages/actions/src/eth/EthJsonRpcResponse.ts:78](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/eth/EthJsonRpcResponse.ts#L78)

JSON-RPC response for `eth_feeHistory` procedure
