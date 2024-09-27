---
editUrl: false
next: false
prev: false
title: "EthCallJsonRpcRequest"
---

> **EthCallJsonRpcRequest**: [`JsonRpcRequest`](/reference/tevm/jsonrpc/type-aliases/jsonrpcrequest/)\<`"eth_call"`, readonly [[`JsonRpcTransaction`](/reference/tevm/actions/type-aliases/jsonrpctransaction/), [`BlockTag`](/reference/tevm/utils/type-aliases/blocktag/) \| [`Hex`](/reference/tevm/utils/type-aliases/hex/), `SerializeToJson`\<[`BaseCallParams`](/reference/tevm/actions/type-aliases/basecallparams/)\[`"stateOverrideSet"`\]\>, `SerializeToJson`\<[`BaseCallParams`](/reference/tevm/actions/type-aliases/basecallparams/)\[`"blockOverrideSet"`\]\>]\>

JSON-RPC request for `eth_call` procedure

## Defined in

[packages/actions/src/eth/EthJsonRpcRequest.ts:51](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/eth/EthJsonRpcRequest.ts#L51)
