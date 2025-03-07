[**@tevm/actions**](../README.md)

***

[@tevm/actions](../globals.md) / EthSignTransactionJsonRpcRequest

# Type Alias: EthSignTransactionJsonRpcRequest

> **EthSignTransactionJsonRpcRequest**: `JsonRpcRequest`\<`"eth_signTransaction"`, readonly \[\{ `chainId`: `Hex`; `data`: `Hex`; `from`: `Address`; `gas`: `Hex`; `gasPrice`: `Hex`; `nonce`: `Hex`; `to`: `Address`; `value`: `Hex`; \}\]\>

Defined in: [packages/actions/src/eth/EthJsonRpcRequest.ts:253](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/eth/EthJsonRpcRequest.ts#L253)

JSON-RPC request for `eth_signTransaction` procedure
