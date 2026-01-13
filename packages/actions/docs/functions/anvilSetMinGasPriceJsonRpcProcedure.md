[**@tevm/actions**](../README.md)

***

[@tevm/actions](../globals.md) / anvilSetMinGasPriceJsonRpcProcedure

# Function: anvilSetMinGasPriceJsonRpcProcedure()

> **anvilSetMinGasPriceJsonRpcProcedure**(`client`): [`AnvilSetMinGasPriceProcedure`](../type-aliases/AnvilSetMinGasPriceProcedure.md)

Defined in: [packages/actions/src/anvil/anvilSetMinGasPriceProcedure.js:40](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/anvil/anvilSetMinGasPriceProcedure.js#L40)

Request handler for anvil_setMinGasPrice JSON-RPC requests.
Sets the minimum gas price for transactions. Transactions with a gas price
below this value will be rejected by the transaction pool.

## Parameters

### client

`TevmNode`\<`"fork"` \| `"normal"`, \{ \}\>

## Returns

[`AnvilSetMinGasPriceProcedure`](../type-aliases/AnvilSetMinGasPriceProcedure.md)

## Example

```typescript
import { createTevmNode } from '@tevm/node'
import { anvilSetMinGasPriceJsonRpcProcedure } from '@tevm/actions'

const client = createTevmNode()
const procedure = anvilSetMinGasPriceJsonRpcProcedure(client)

const result = await procedure({
  jsonrpc: '2.0',
  method: 'anvil_setMinGasPrice',
  params: ['0x3B9ACA00'], // 1 gwei in hex
  id: 1,
})
// result: { jsonrpc: '2.0', method: 'anvil_setMinGasPrice', result: null, id: 1 }

// Transactions with gas price below 1 gwei will be rejected
const lowGasTx = await client.tevmCall({
  to: '0x1234...',
  data: '0x...',
  gasPrice: 500000000n, // 0.5 gwei - will be rejected
})
// lowGasTx.errors will contain a rejection error

const highGasTx = await client.tevmCall({
  to: '0x1234...',
  data: '0x...',
  gasPrice: 2000000000n, // 2 gwei - will be accepted
})
// highGasTx will execute successfully
```
