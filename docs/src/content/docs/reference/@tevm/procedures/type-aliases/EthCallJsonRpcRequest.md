---
editUrl: false
next: false
prev: false
title: "EthCallJsonRpcRequest"
---

> **EthCallJsonRpcRequest**: [`JsonRpcRequest`](/reference/tevm/jsonrpc/type-aliases/jsonrpcrequest/)\<`"eth_call"`, readonly [[`JsonRpcTransaction`](/reference/tevm/procedures/type-aliases/jsonrpctransaction/), [`BlockTag`](/reference/tevm/utils/type-aliases/blocktag/) \| [`Hex`](/reference/tevm/utils/type-aliases/hex/), [`SerializeToJson`](/reference/tevm/procedures/type-aliases/serializetojson/)\<[`BaseCallParams`](/reference/tevm/actions/type-aliases/basecallparams/)\[`"stateOverrideSet"`\]\>, [`SerializeToJson`](/reference/tevm/procedures/type-aliases/serializetojson/)\<[`BaseCallParams`](/reference/tevm/actions/type-aliases/basecallparams/)\[`"blockOverrideSet"`\]\>]\>

JSON-RPC request for `eth_call` procedure

## Defined in

[procedures/src/eth/EthJsonRpcRequest.ts:50](https://github.com/evmts/tevm-monorepo/blob/main/packages/procedures/src/eth/EthJsonRpcRequest.ts#L50)
