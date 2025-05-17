[**@tevm/actions**](../README.md)

***

[@tevm/actions](../globals.md) / anvilResetJsonRpcProcedure

# Function: anvilResetJsonRpcProcedure()

> **anvilResetJsonRpcProcedure**(`node`): [`AnvilResetProcedure`](../type-aliases/AnvilResetProcedure.md)

Defined in: [packages/actions/src/anvil/anvilResetProcedure.js:15](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/anvil/anvilResetProcedure.js#L15)

Request handler for anvil_reset JSON-RPC requests.
If the node is forked, anvil_reset will reset to the forked block.

## Parameters

### node

`TevmNode`\<`"fork"` \| `"normal"`, \{ \}\>

## Returns

[`AnvilResetProcedure`](../type-aliases/AnvilResetProcedure.md)

## Example

```ts
const node = createTevmNode()
const resetProcedure = anvilResetJsonRpcProcedure(node)
const result = await resetProcedure({ method: 'anvil_reset', params: [], id: 1, jsonrpc: '2.0' })
console.log(result) // { result: null, method: 'anvil_reset', jsonrpc: '2.0', id: 1 }
```
