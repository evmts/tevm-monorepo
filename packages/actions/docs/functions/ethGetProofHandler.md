[**@tevm/actions**](../README.md)

***

[@tevm/actions](../globals.md) / ethGetProofHandler

# Function: ethGetProofHandler()

> **ethGetProofHandler**(`client`): [`EthGetProofHandler`](../type-aliases/EthGetProofHandler.md)

Defined in: [packages/actions/src/eth/ethGetProofHandler.js:37](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/eth/ethGetProofHandler.js#L37)

Handler for the `eth_getProof` RPC method.
Returns the account and storage values of the specified account including the Merkle-proof.
Currently only works in forked mode as TEVM does not merklelize state locally.

## Parameters

### client

`TevmNode`\<`"fork"` \| `"normal"`, \{ \}\>

## Returns

[`EthGetProofHandler`](../type-aliases/EthGetProofHandler.md)

## Example

```javascript
import { createTevmNode } from '@tevm/node'
import { ethGetProofHandler } from '@tevm/actions'

const node = createTevmNode({
  fork: { transport: http('https://mainnet.optimism.io') }
})
const handler = ethGetProofHandler(node)
const proof = await handler({
  address: '0x1234567890123456789012345678901234567890',
  storageKeys: ['0x0000000000000000000000000000000000000000000000000000000000000000'],
  blockTag: 'latest',
})
console.log(proof)
// {
//   address: '0x1234567890123456789012345678901234567890',
//   accountProof: ['0x...', ...],
//   balance: '0x0',
//   codeHash: '0x...',
//   nonce: '0x0',
//   storageHash: '0x...',
//   storageProof: [{ key: '0x...', value: '0x...', proof: ['0x...'] }]
// }
```
