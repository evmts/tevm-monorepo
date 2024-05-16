---
editUrl: false
next: false
prev: false
title: "EthCallJsonRpcRequest"
---

> **EthCallJsonRpcRequest**: [`JsonRpcRequest`](/reference/tevm/jsonrpc/type-aliases/jsonrpcrequest/)\<`"eth_call"`, readonly [[`JsonRpcTransaction`](/reference/tevm/procedures-types/type-aliases/jsonrpctransaction/), [`BlockTag`](/reference/tevm/utils/type-aliases/blocktag/) \| [`Hex`](/reference/tevm/utils/type-aliases/hex/), [`SerializeToJson`](/reference/tevm/procedures-types/type-aliases/serializetojson/)\<[`BaseCallParams`](/reference/tevm/actions-types/type-aliases/basecallparams/)\[`"stateOverrideSet"`\]\>, [`SerializeToJson`](/reference/tevm/procedures-types/type-aliases/serializetojson/)\<[`BaseCallParams`](/reference/tevm/actions-types/type-aliases/basecallparams/)\[`"blockOverrideSet"`\]\>]\>

JSON-RPC request for `eth_call` procedure

## Source

[requests/EthJsonRpcRequest.ts:50](https://github.com/evmts/tevm-monorepo/blob/main/packages/procedures-types/src/requests/EthJsonRpcRequest.ts#L50)
