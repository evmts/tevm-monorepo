**@tevm/block** ∙ [README](../README.md) ∙ [API](../API.md)

***

[API](../API.md) > blockFromRpc

# Function: blockFromRpc()

> **blockFromRpc**(`blockParams`, `options`, `uncles`): [`Block`](../classes/Block.md)

Creates a new block object from Ethereum JSON RPC.

## Parameters

▪ **blockParams**: [`JsonRpcBlock`](../interfaces/JsonRpcBlock.md)

Ethereum JSON RPC of block (eth_getBlockByNumber)

▪ **options**: [`BlockOptions`](../interfaces/BlockOptions.md)

An object describing the blockchain

▪ **uncles**: `any`[]= `[]`

Optional list of Ethereum JSON RPC of uncles (eth_getUncleByBlockHashAndIndex)

## Returns

## Deprecated

## Source

[from-rpc.ts:38](https://github.com/evmts/tevm-monorepo/blob/main/packages/block/src/from-rpc.ts#L38)

***
Generated using [typedoc-plugin-markdown](https://www.npmjs.com/package/typedoc-plugin-markdown) and [TypeDoc](https://typedoc.org/)
