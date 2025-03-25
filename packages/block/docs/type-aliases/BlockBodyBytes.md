[**@tevm/block**](../README.md)

***

[@tevm/block](../globals.md) / BlockBodyBytes

# Type Alias: BlockBodyBytes

> **BlockBodyBytes** = \[[`TransactionsBytes`](TransactionsBytes.md), [`UncleHeadersBytes`](UncleHeadersBytes.md), [`WithdrawalsBytes`](WithdrawalsBytes.md)?, `Uint8Array`?\]

Defined in: [packages/block/src/types.ts:383](https://github.com/evmts/tevm-monorepo/blob/main/packages/block/src/types.ts#L383)

Represents the serialized form of an Ethereum block body

Contains all block components except the header. The structure is:
- First element: Transactions bytes
- Second element: Uncle headers bytes
- Third element (optional): Withdrawals bytes (post-Shanghai)
- Fourth element (optional): Additional data (like consensus layer requests)

Used when transmitting or processing block bodies separately from headers,
typically in Ethereum's P2P protocols.

## Example

```typescript
import { BlockBodyBytes, BlockBody } from '@tevm/block'

// Decode a block body
function decodeBlockBody(bodyBytes: BlockBodyBytes): BlockBody {
  const [txBytes, uncleBytes, withdrawalBytes] = bodyBytes

  return {
    transactions: decodeTxs(txBytes),
    uncleHeaders: decodeUncles(uncleBytes),
    ...(withdrawalBytes ? { withdrawals: decodeWithdrawals(withdrawalBytes) } : {})
  }
}

// For network transmission
function getBlockBody(block: Block): BlockBodyBytes {
  const body: BlockBodyBytes = [
    encodeTxs(block.transactions),
    encodeUncles(block.uncleHeaders)
  ]

  if (block.withdrawals) {
    body.push(encodeWithdrawals(block.withdrawals))
  }

  return body
}
```
