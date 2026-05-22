[**tevm**](../../README.md)

***

[tevm](../../modules.md) / [vm](../README.md) / EIP4844BlobTxReceipt

# Interface: EIP4844BlobTxReceipt

Transaction receipt format for EIP-4844 blob transactions.
Extends PostByzantiumTxReceipt with additional blob gas information.

## Example

```typescript
import { EIP4844BlobTxReceipt } from '@tevm/vm'

const receipt: EIP4844BlobTxReceipt = {
  status: 1n,
  cumulativeBlockGasUsed: 100000n,
  bitvector: new Uint8Array([]),
  logs: [],
  blobGasUsed: 131072n,
  blobGasPrice: 10n
}
```

## Extends

- [`PostByzantiumTxReceipt`](PostByzantiumTxReceipt.md)

## Properties

| Property | Type | Description | Inherited from |
| ------ | ------ | ------ | ------ |
| <a id="bitvector"></a> `bitvector` | `Uint8Array` | Bloom bitvector | [`PostByzantiumTxReceipt`](PostByzantiumTxReceipt.md).[`bitvector`](PostByzantiumTxReceipt.md#bitvector) |
| <a id="blobgasprice"></a> `blobGasPrice` | `bigint` | blob gas price for block transaction was included in Note: This valus is not included in the `receiptRLP` used for encoding the `receiptsRoot` in a block and is only provided as part of receipt metadata. | - |
| <a id="blobgasused"></a> `blobGasUsed` | `bigint` | blob gas consumed by a transaction Note: This value is not included in the receiptRLP used for encoding the receiptsRoot in a block and is only provided as part of receipt metadata. | - |
| <a id="cumulativeblockgasused"></a> `cumulativeBlockGasUsed` | `bigint` | Cumulative gas used in the block including this tx | [`PostByzantiumTxReceipt`](PostByzantiumTxReceipt.md).[`cumulativeBlockGasUsed`](PostByzantiumTxReceipt.md#cumulativeblockgasused) |
| <a id="logs"></a> `logs` | [`EthjsLog`](../../utils/type-aliases/EthjsLog.md)[] | Logs emitted | [`PostByzantiumTxReceipt`](PostByzantiumTxReceipt.md).[`logs`](PostByzantiumTxReceipt.md#logs) |
| <a id="status"></a> `status` | `0` \| `1` | Status of transaction, `1` if successful, `0` if an exception occurred | [`PostByzantiumTxReceipt`](PostByzantiumTxReceipt.md).[`status`](PostByzantiumTxReceipt.md#status) |
