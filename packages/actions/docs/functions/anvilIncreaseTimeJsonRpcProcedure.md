[**@tevm/actions**](../README.md)

***

[@tevm/actions](../globals.md) / anvilIncreaseTimeJsonRpcProcedure

# Function: anvilIncreaseTimeJsonRpcProcedure()

> **anvilIncreaseTimeJsonRpcProcedure**(`client`): [`AnvilIncreaseTimeProcedure`](../type-aliases/AnvilIncreaseTimeProcedure.md)

Defined in: [packages/actions/src/anvil/anvilIncreaseTimeProcedure.js:17](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/anvil/anvilIncreaseTimeProcedure.js#L17)

JSON-RPC procedure for anvil_increaseTime
Jump forward in time by the given amount of time, in seconds.

## Parameters

### client

`TevmNode`\<`"fork"` \| `"normal"`, \{ \}\>

## Returns

[`AnvilIncreaseTimeProcedure`](../type-aliases/AnvilIncreaseTimeProcedure.md)

## Example

```typescript
const response = await client.request({
  method: 'anvil_increaseTime',
  params: ['0x3c'], // 60 seconds
  id: 1,
  jsonrpc: '2.0'
})
// response.result will be '0x3c' (the number of seconds increased)
```
