**@tevm/procedures-types** ∙ [README](../README.md) ∙ [API](../API.md)

***

[API](../API.md) > EthCallJsonRpcRequest

# Type alias: EthCallJsonRpcRequest

> **EthCallJsonRpcRequest**: `JsonRpcRequest`\<`"eth_call"`, readonly [[`JsonRpcTransaction`](JsonRpcTransaction.md), `BlockTag` \| `Hex`, [`SerializeToJson`](SerializeToJson.md)\<`BaseCallParams`[`"stateOverrideSet"`]\>, [`SerializeToJson`](SerializeToJson.md)\<`BaseCallParams`[`"blockOverrideSet"`]\>]\>

JSON-RPC request for `eth_call` procedure

## Source

[requests/EthJsonRpcRequest.ts:56](https://github.com/evmts/tevm-monorepo/blob/main/packages/procedures-types/src/requests/EthJsonRpcRequest.ts#L56)

***
Generated using [typedoc-plugin-markdown](https://www.npmjs.com/package/typedoc-plugin-markdown) and [TypeDoc](https://typedoc.org/)
