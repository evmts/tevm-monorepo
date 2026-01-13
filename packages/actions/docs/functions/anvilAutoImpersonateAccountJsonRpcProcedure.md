[**@tevm/actions**](../README.md)

***

[@tevm/actions](../globals.md) / anvilAutoImpersonateAccountJsonRpcProcedure

# Function: anvilAutoImpersonateAccountJsonRpcProcedure()

> **anvilAutoImpersonateAccountJsonRpcProcedure**(`client`): [`AnvilAutoImpersonateAccountProcedure`](../type-aliases/AnvilAutoImpersonateAccountProcedure.md)

Defined in: [packages/actions/src/anvil/anvilAutoImpersonateAccountProcedure.js:26](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/anvil/anvilAutoImpersonateAccountProcedure.js#L26)

Request handler for anvil_autoImpersonateAccount JSON-RPC requests.
Enables or disables automatic impersonation of all transaction senders.

## Parameters

### client

`TevmNode`\<`"fork"` \| `"normal"`, \{ \}\>

## Returns

[`AnvilAutoImpersonateAccountProcedure`](../type-aliases/AnvilAutoImpersonateAccountProcedure.md)

## Example

```typescript
// Enable auto-impersonation
const result = await client.request({
  method: 'anvil_autoImpersonateAccount',
  params: [true],
  id: 1,
  jsonrpc: '2.0'
})
console.log(result) // { jsonrpc: '2.0', id: 1, method: 'anvil_autoImpersonateAccount', result: null }

// Disable auto-impersonation
const result2 = await client.request({
  method: 'anvil_autoImpersonateAccount',
  params: [false],
  id: 2,
  jsonrpc: '2.0'
})
```
