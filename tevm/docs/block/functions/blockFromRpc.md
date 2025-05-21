[**tevm**](../../README.md)

***

[tevm](../../modules.md) / [block](../README.md) / blockFromRpc

# Function: ~~blockFromRpc()~~

> **blockFromRpc**(`blockParams`, `options`, `uncles?`): [`Block`](../classes/Block.md)

Defined in: packages/block/types/from-rpc.d.ts:11

Creates a new block object from Ethereum JSON RPC.

## Parameters

### blockParams

[`JsonRpcBlock`](../interfaces/JsonRpcBlock.md)

Ethereum JSON RPC of block (eth_getBlockByNumber)

### options

[`BlockOptions`](../interfaces/BlockOptions.md)

An object describing the blockchain

### uncles?

`any`[]

Optional list of Ethereum JSON RPC of uncles (eth_getUncleByBlockHashAndIndex)

## Returns

[`Block`](../classes/Block.md)

## Deprecated
