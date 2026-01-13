[**@tevm/actions**](../README.md)

***

[@tevm/actions](../globals.md) / anvilSetTimeJsonRpcProcedure

# Function: anvilSetTimeJsonRpcProcedure()

> **anvilSetTimeJsonRpcProcedure**(`client`): [`AnvilSetTimeProcedure`](../type-aliases/AnvilSetTimeProcedure.md)

Defined in: [packages/actions/src/anvil/anvilSetTimeProcedure.js:18](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/anvil/anvilSetTimeProcedure.js#L18)

JSON-RPC procedure for anvil_setTime
Sets the current block timestamp. This is similar to anvil_setNextBlockTimestamp,
but sets the timestamp for the next block to mine.

## Parameters

### client

`TevmNode`\<`"fork"` \| `"normal"`, \{ \}\>

## Returns

[`AnvilSetTimeProcedure`](../type-aliases/AnvilSetTimeProcedure.md)

## Example

```typescript
const response = await client.request({
  method: 'anvil_setTime',
  params: ['0x61234567'], // Unix timestamp or number
  id: 1,
  jsonrpc: '2.0'
})
// response.result will be the new timestamp
```
