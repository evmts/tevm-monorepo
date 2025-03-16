[**@tevm/block**](../README.md)

***

[@tevm/block](../globals.md) / BlockBytes

# Type Alias: BlockBytes

> **BlockBytes**: \[[`BlockHeaderBytes`](BlockHeaderBytes.md), [`TransactionsBytes`](TransactionsBytes.md), [`UncleHeadersBytes`](UncleHeadersBytes.md)\] \| \[[`BlockHeaderBytes`](BlockHeaderBytes.md), [`TransactionsBytes`](TransactionsBytes.md), [`UncleHeadersBytes`](UncleHeadersBytes.md), [`WithdrawalsBytes`](WithdrawalsBytes.md)\] \| \[[`BlockHeaderBytes`](BlockHeaderBytes.md), [`TransactionsBytes`](TransactionsBytes.md), [`UncleHeadersBytes`](UncleHeadersBytes.md), [`WithdrawalsBytes`](WithdrawalsBytes.md), [`RequestsBytes`](RequestsBytes.md)\] \| \[[`BlockHeaderBytes`](BlockHeaderBytes.md), [`TransactionsBytes`](TransactionsBytes.md), [`UncleHeadersBytes`](UncleHeadersBytes.md), [`WithdrawalsBytes`](WithdrawalsBytes.md), [`RequestsBytes`](RequestsBytes.md), [`ExecutionWitnessBytes`](ExecutionWitnessBytes.md)\]

Defined in: [packages/block/src/types.ts:331](https://github.com/evmts/tevm-monorepo/blob/main/packages/block/src/types.ts#L331)

Represents the serialized form of an Ethereum block

The structure is a tuple of components, with variations depending on the Ethereum hardfork:
- First element: Block header bytes
- Second element: Transactions bytes
- Third element: Uncle headers bytes
- Fourth element (optional): Withdrawals bytes (post-Shanghai)
- Fifth element (optional): Requests bytes (post-Cancun)
- Sixth element (optional): Execution witness bytes (for stateless Ethereum)

The format evolves with new Ethereum upgrades as additional block components are added.

## Example

```typescript
import { BlockBytes, Block } from '@tevm/block'
import { decode } from '@tevm/rlp'

// Decode a complete block from its serialized form
function decodeBlock(blockBytes: BlockBytes): Block {
  // Determine format based on array length
  if (blockBytes.length === 3) {
    // Pre-Shanghai format
    const [headerBytes, txBytes, uncleBytes] = blockBytes
    return {
      header: decodeHeader(headerBytes),
      transactions: decodeTxs(txBytes),
      uncleHeaders: decodeUncles(uncleBytes),
    }
  } else if (blockBytes.length === 4) {
    // Post-Shanghai format with withdrawals
    const [headerBytes, txBytes, uncleBytes, withdrawalBytes] = blockBytes
    return {
      header: decodeHeader(headerBytes),
      transactions: decodeTxs(txBytes),
      uncleHeaders: decodeUncles(uncleBytes),
      withdrawals: decodeWithdrawals(withdrawalBytes),
    }
  }
  // Handle other formats as needed
}
```
