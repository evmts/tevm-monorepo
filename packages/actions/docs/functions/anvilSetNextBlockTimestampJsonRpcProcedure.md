[**@tevm/actions**](../README.md)

***

[@tevm/actions](../globals.md) / anvilSetNextBlockTimestampJsonRpcProcedure

# Function: anvilSetNextBlockTimestampJsonRpcProcedure()

> **anvilSetNextBlockTimestampJsonRpcProcedure**(`client`): [`AnvilSetNextBlockTimestampProcedure`](../type-aliases/AnvilSetNextBlockTimestampProcedure.md)

Defined in: [packages/actions/src/anvil/anvilSetNextBlockTimestampProcedure.js:17](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/anvil/anvilSetNextBlockTimestampProcedure.js#L17)

JSON-RPC procedure for anvil_setNextBlockTimestamp
Sets the timestamp of the next block

## Parameters

### client

`TevmNode`\<`"fork"` \| `"normal"`, \{ \}\>

## Returns

[`AnvilSetNextBlockTimestampProcedure`](../type-aliases/AnvilSetNextBlockTimestampProcedure.md)

## Example

```typescript
const response = await client.request({
  method: 'anvil_setNextBlockTimestamp',
  params: ['0x61234567'], // Unix timestamp
  id: 1,
  jsonrpc: '2.0'
})
// response.result will be null
```
