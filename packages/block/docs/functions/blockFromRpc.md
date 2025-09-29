[**@tevm/block**](../README.md)

***

[@tevm/block](../globals.md) / blockFromRpc

# ~~Function: blockFromRpc()~~

> **blockFromRpc**(`blockParams`, `options`, `uncles`): [`Block`](../classes/Block.md)

Defined in: [packages/block/src/from-rpc.ts:36](https://github.com/evmts/tevm-monorepo/blob/main/packages/block/src/from-rpc.ts#L36)

Creates a new block object from Ethereum JSON RPC.

## Parameters

### blockParams

[`JsonRpcBlock`](../interfaces/JsonRpcBlock.md)

Ethereum JSON RPC of block (eth_getBlockByNumber)

### options

[`BlockOptions`](../interfaces/BlockOptions.md)

An object describing the blockchain

### uncles

`any`[] = `[]`

Optional list of Ethereum JSON RPC of uncles (eth_getUncleByBlockHashAndIndex)

## Returns

[`Block`](../classes/Block.md)

## Deprecated
