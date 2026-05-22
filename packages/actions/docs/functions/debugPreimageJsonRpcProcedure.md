[**@tevm/actions**](../README.md)

***

[@tevm/actions](../globals.md) / debugPreimageJsonRpcProcedure

# Function: debugPreimageJsonRpcProcedure()

> **debugPreimageJsonRpcProcedure**(`client`): `DebugPreimageProcedure`

Defined in: [packages/actions/src/debug/debugPreimageProcedure.js:18](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/debug/debugPreimageProcedure.js#L18)

Creates a JSON-RPC procedure handler for the `debug_preimage` method

This handler returns the preimage (original data) for a given SHA3 hash if it
has been tracked/stored by the node. Preimages are typically tracked for
storage keys and account data to enable debugging and state inspection.

Note: In the current implementation, preimage tracking is limited. The node
only tracks preimages that it has explicitly cached. For most use cases,
this will return null as full preimage tracking has significant performance
and storage overhead.

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `client` | `TevmNode`\<`"fork"` \| `"normal"`, \{ \}\> | - |

## Returns

`DebugPreimageProcedure`
