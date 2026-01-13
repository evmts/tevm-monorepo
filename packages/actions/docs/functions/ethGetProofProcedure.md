[**@tevm/actions**](../README.md)

***

[@tevm/actions](../globals.md) / ethGetProofProcedure

# Function: ethGetProofProcedure()

> **ethGetProofProcedure**(`client`): [`EthGetProofJsonRpcProcedure`](../type-aliases/EthGetProofJsonRpcProcedure.md)

Defined in: [packages/actions/src/eth/ethGetProofProcedure.js:36](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/eth/ethGetProofProcedure.js#L36)

JSON-RPC procedure for `eth_getProof`.
Returns the account and storage values of the specified account including the Merkle-proof.

## Parameters

### client

`TevmNode`\<`"fork"` \| `"normal"`, \{ \}\>

## Returns

[`EthGetProofJsonRpcProcedure`](../type-aliases/EthGetProofJsonRpcProcedure.md)

## Example

```javascript
import { createTevmNode } from '@tevm/node'
import { ethGetProofProcedure } from '@tevm/actions'

const node = createTevmNode({
  fork: { transport: http('https://mainnet.optimism.io') }
})
const procedure = ethGetProofProcedure(node)
const response = await procedure({
  jsonrpc: '2.0',
  method: 'eth_getProof',
  id: 1,
  params: [
    '0x1234567890123456789012345678901234567890',
    ['0x0000000000000000000000000000000000000000000000000000000000000000'],
    'latest'
  ],
})
console.log(response.result)
// {
//   address: '0x1234567890123456789012345678901234567890',
//   accountProof: ['0x...', ...],
//   balance: '0x0',
//   ...
// }
```
