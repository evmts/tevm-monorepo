[**@tevm/actions**](../README.md)

***

[@tevm/actions](../globals.md) / anvilSetBlockTimestampIntervalJsonRpcProcedure

# Function: anvilSetBlockTimestampIntervalJsonRpcProcedure()

> **anvilSetBlockTimestampIntervalJsonRpcProcedure**(`client`): [`AnvilSetBlockTimestampIntervalProcedure`](../type-aliases/AnvilSetBlockTimestampIntervalProcedure.md)

Defined in: [packages/actions/src/anvil/anvilSetBlockTimestampIntervalProcedure.js:17](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/anvil/anvilSetBlockTimestampIntervalProcedure.js#L17)

JSON-RPC procedure for anvil_setBlockTimestampInterval
Sets the interval (in seconds) to automatically add to timestamps between blocks

## Parameters

### client

`TevmNode`\<`"fork"` \| `"normal"`, \{ \}\>

## Returns

[`AnvilSetBlockTimestampIntervalProcedure`](../type-aliases/AnvilSetBlockTimestampIntervalProcedure.md)

## Example

```typescript
const response = await client.request({
  method: 'anvil_setBlockTimestampInterval',
  params: ['0xc'], // 12 seconds between each block
  id: 1,
  jsonrpc: '2.0'
})
// response.result will be null
```
