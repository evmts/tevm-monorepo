---
editUrl: false
next: false
prev: false
title: "EthEstimateGasJsonRpcRequest"
---

> **EthEstimateGasJsonRpcRequest**: [`JsonRpcRequest`](/reference/tevm/jsonrpc/type-aliases/jsonrpcrequest/)\<`"eth_estimateGas"`, readonly [[`JsonRpcTransaction`](/reference/tevm/actions/type-aliases/jsonrpctransaction/), [`BlockTag`](/reference/tevm/utils/type-aliases/blocktag/) \| [`Hex`](/reference/tevm/utils/type-aliases/hex/), `SerializeToJson`\<[`BaseCallParams`](/reference/tevm/actions/type-aliases/basecallparams/)\[`"stateOverrideSet"`\]\>, `SerializeToJson`\<[`BaseCallParams`](/reference/tevm/actions/type-aliases/basecallparams/)\[`"blockOverrideSet"`\]\>]\>

JSON-RPC request for `eth_estimateGas` procedure

## Defined in

[packages/actions/src/eth/EthJsonRpcRequest.ts:74](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/eth/EthJsonRpcRequest.ts#L74)
