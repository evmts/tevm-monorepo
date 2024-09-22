---
editUrl: false
next: false
prev: false
title: "EthEstimateGasJsonRpcRequest"
---

> **EthEstimateGasJsonRpcRequest**: [`JsonRpcRequest`](/reference/tevm/jsonrpc/type-aliases/jsonrpcrequest/)\<`"eth_estimateGas"`, readonly [[`JsonRpcTransaction`](/reference/tevm/procedures/type-aliases/jsonrpctransaction/), [`BlockTag`](/reference/tevm/utils/type-aliases/blocktag/) \| [`Hex`](/reference/tevm/utils/type-aliases/hex/), [`SerializeToJson`](/reference/tevm/procedures/type-aliases/serializetojson/)\<[`BaseCallParams`](/reference/tevm/actions/type-aliases/basecallparams/)\[`"stateOverrideSet"`\]\>, [`SerializeToJson`](/reference/tevm/procedures/type-aliases/serializetojson/)\<[`BaseCallParams`](/reference/tevm/actions/type-aliases/basecallparams/)\[`"blockOverrideSet"`\]\>]\>

JSON-RPC request for `eth_estimateGas` procedure

## Defined in

[packages/procedures/src/eth/EthJsonRpcRequest.ts:73](https://github.com/evmts/tevm-monorepo/blob/main/packages/procedures/src/eth/EthJsonRpcRequest.ts#L73)
