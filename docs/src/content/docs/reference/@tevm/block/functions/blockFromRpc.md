---
editUrl: false
next: false
prev: false
title: "blockFromRpc"
---

> **blockFromRpc**(`blockParams`, `options`, `uncles`): [`Block`](/reference/tevm/block/classes/block/)

Creates a new block object from Ethereum JSON RPC.

:::caution[Deprecated]
This API is no longer supported and may be removed in a future release.
:::

## Parameters

• **blockParams**: [`JsonRpcBlock`](/reference/tevm/block/interfaces/jsonrpcblock/)

Ethereum JSON RPC of block (eth_getBlockByNumber)

• **options**: [`BlockOptions`](/reference/tevm/block/interfaces/blockoptions/)

An object describing the blockchain

• **uncles**: `any`[] = `[]`

Optional list of Ethereum JSON RPC of uncles (eth_getUncleByBlockHashAndIndex)

## Returns

[`Block`](/reference/tevm/block/classes/block/)

## Defined in

[from-rpc.ts:39](https://github.com/evmts/tevm-monorepo/blob/main/packages/block/src/from-rpc.ts#L39)
