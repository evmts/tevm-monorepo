[**@tevm/actions**](../README.md)

***

[@tevm/actions](../globals.md) / EthSignTransactionJsonRpcRequest

# Type Alias: EthSignTransactionJsonRpcRequest

> **EthSignTransactionJsonRpcRequest** = `JsonRpcRequest`\<`"eth_signTransaction"`, readonly \[\{ `accessList?`: readonly `object`[]; `authorizationList?`: readonly `unknown`[]; `blobVersionedHashes?`: readonly `Hex`[]; `chainId?`: `Hex`; `data?`: `Hex`; `from`: `Address`; `gas?`: `Hex`; `gasPrice?`: `Hex`; `maxFeePerBlobGas?`: `Hex`; `maxFeePerGas?`: `Hex`; `maxPriorityFeePerGas?`: `Hex`; `nonce?`: `Hex`; `to?`: `Address`; `type?`: `Hex`; `value?`: `Hex`; \}\]\>

Defined in: [packages/actions/src/eth/EthJsonRpcRequest.ts:283](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/eth/EthJsonRpcRequest.ts#L283)

JSON-RPC request for `eth_signTransaction` procedure
