[**@tevm/actions**](../README.md)

***

[@tevm/actions](../globals.md) / ethGetBlockReceiptsJsonRpcProcedure

# Function: ethGetBlockReceiptsJsonRpcProcedure()

> **ethGetBlockReceiptsJsonRpcProcedure**(`client`): [`EthGetBlockReceiptsJsonRpcProcedure`](../type-aliases/EthGetBlockReceiptsJsonRpcProcedure.md)

Defined in: [packages/actions/src/eth/ethGetBlockReceiptsProcedure.js:29](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/eth/ethGetBlockReceiptsProcedure.js#L29)

Procedure for handling eth_getBlockReceipts JSON-RPC requests.

This procedure validates the request parameters and calls the handler to retrieve
all transaction receipts for the specified block.

## Parameters

### client

`TevmNode`\<`"fork"` \| `"normal"`, \{ \}\>

The Tevm client instance

## Returns

[`EthGetBlockReceiptsJsonRpcProcedure`](../type-aliases/EthGetBlockReceiptsJsonRpcProcedure.md)

The JSON-RPC procedure

## Example

```javascript
import { createTevmNode } from '@tevm/node'
import { ethGetBlockReceiptsProcedure } from '@tevm/actions'

const client = await createTevmNode()
const procedure = ethGetBlockReceiptsProcedure(client)

const response = await procedure({
  jsonrpc: '2.0',
  method: 'eth_getBlockReceipts',
  params: ['0x1234'],
  id: 1
})
```
