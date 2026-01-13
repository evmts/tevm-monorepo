[**@tevm/actions**](../README.md)

***

[@tevm/actions](../globals.md) / anvilDropAllTransactionsJsonRpcProcedure

# Function: anvilDropAllTransactionsJsonRpcProcedure()

> **anvilDropAllTransactionsJsonRpcProcedure**(`client`): [`AnvilDropAllTransactionsProcedure`](../type-aliases/AnvilDropAllTransactionsProcedure.md)

Defined in: [packages/actions/src/anvil/anvilDropAllTransactionsProcedure.js:17](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/anvil/anvilDropAllTransactionsProcedure.js#L17)

Request handler for anvil_dropAllTransactions JSON-RPC requests.
Removes all transactions from the transaction pool.

## Parameters

### client

`TevmNode`\<`"fork"` \| `"normal"`, \{ \}\>

## Returns

[`AnvilDropAllTransactionsProcedure`](../type-aliases/AnvilDropAllTransactionsProcedure.md)

## Example

```typescript
const result = await client.request({
  method: 'anvil_dropAllTransactions',
  params: [],
  id: 1,
  jsonrpc: '2.0'
})
console.log(result) // { jsonrpc: '2.0', id: 1, method: 'anvil_dropAllTransactions', result: null }
```
