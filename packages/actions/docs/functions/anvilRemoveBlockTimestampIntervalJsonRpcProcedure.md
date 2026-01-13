[**@tevm/actions**](../README.md)

***

[@tevm/actions](../globals.md) / anvilRemoveBlockTimestampIntervalJsonRpcProcedure

# Function: anvilRemoveBlockTimestampIntervalJsonRpcProcedure()

> **anvilRemoveBlockTimestampIntervalJsonRpcProcedure**(`client`): [`AnvilRemoveBlockTimestampIntervalProcedure`](../type-aliases/AnvilRemoveBlockTimestampIntervalProcedure.md)

Defined in: [packages/actions/src/anvil/anvilRemoveBlockTimestampIntervalProcedure.js:17](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/anvil/anvilRemoveBlockTimestampIntervalProcedure.js#L17)

JSON-RPC procedure for anvil_removeBlockTimestampInterval
Removes the automatic timestamp interval between blocks

## Parameters

### client

`TevmNode`\<`"fork"` \| `"normal"`, \{ \}\>

## Returns

[`AnvilRemoveBlockTimestampIntervalProcedure`](../type-aliases/AnvilRemoveBlockTimestampIntervalProcedure.md)

## Example

```typescript
const response = await client.request({
  method: 'anvil_removeBlockTimestampInterval',
  params: [],
  id: 1,
  jsonrpc: '2.0'
})
// response.result will be true
```
