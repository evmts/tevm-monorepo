[**@tevm/actions**](../README.md)

***

[@tevm/actions](../globals.md) / anvilRemovePoolTransactionsJsonRpcProcedure

# Function: anvilRemovePoolTransactionsJsonRpcProcedure()

> **anvilRemovePoolTransactionsJsonRpcProcedure**(`client`): [`AnvilRemovePoolTransactionsProcedure`](../type-aliases/AnvilRemovePoolTransactionsProcedure.md)

Defined in: [packages/actions/src/anvil/anvilRemovePoolTransactionsProcedure.js:19](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/anvil/anvilRemovePoolTransactionsProcedure.js#L19)

Request handler for anvil_removePoolTransactions JSON-RPC requests.
Removes all transactions from the pool sent by the given address.

## Parameters

### client

`TevmNode`\<`"fork"` \| `"normal"`, \{ \}\>

## Returns

[`AnvilRemovePoolTransactionsProcedure`](../type-aliases/AnvilRemovePoolTransactionsProcedure.md)

## Example

```typescript
const result = await client.request({
  method: 'anvil_removePoolTransactions',
  params: ['0x1234567890123456789012345678901234567890'],
  id: 1,
  jsonrpc: '2.0'
})
console.log(result) // { jsonrpc: '2.0', id: 1, method: 'anvil_removePoolTransactions', result: null }
```
