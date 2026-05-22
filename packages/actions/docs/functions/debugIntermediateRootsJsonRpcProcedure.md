[**@tevm/actions**](../README.md)

***

[@tevm/actions](../globals.md) / debugIntermediateRootsJsonRpcProcedure

# Function: debugIntermediateRootsJsonRpcProcedure()

> **debugIntermediateRootsJsonRpcProcedure**(`client`): `DebugIntermediateRootsProcedure`

Defined in: [packages/actions/src/debug/debugIntermediateRootsProcedure.js:17](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/debug/debugIntermediateRootsProcedure.js#L17)

Creates a JSON-RPC procedure handler for the `debug_intermediateRoots` method

This handler executes a block and returns the state root after each transaction
has been executed. This is useful for understanding how state changes incrementally
as each transaction in a block is processed.

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `client` | `TevmNode`\<`"fork"` \| `"normal"`, \{ \}\> | - |

## Returns

`DebugIntermediateRootsProcedure`

## Throws

If the block cannot be found or its parent state cannot be forked.
