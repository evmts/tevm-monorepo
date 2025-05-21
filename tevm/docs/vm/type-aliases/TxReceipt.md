[**tevm**](../../README.md)

***

[tevm](../../modules.md) / [vm](../README.md) / TxReceipt

# Type Alias: TxReceipt

> **TxReceipt** = [`PreByzantiumTxReceipt`](../interfaces/PreByzantiumTxReceipt.md) \| [`PostByzantiumTxReceipt`](../interfaces/PostByzantiumTxReceipt.md) \| [`EIP4844BlobTxReceipt`](../interfaces/EIP4844BlobTxReceipt.md)

Defined in: packages/vm/types/utils/TxReceipt.d.ts:21

Union type representing all supported transaction receipt formats.
Includes pre-Byzantium, post-Byzantium, and EIP-4844 blob transaction receipts.
The receipt format varies based on the Ethereum hardfork in use.

## Example

```typescript
import { TxReceipt } from '@tevm/vm'

// Example of a post-Byzantium receipt
const receipt: TxReceipt = {
  status: 1n, // Transaction succeeded
  cumulativeBlockGasUsed: 100000n,
  bitvector: new Uint8Array([]),
  logs: []
}
```
