[**tevm**](../../README.md)

***

[tevm](../../modules.md) / [vm](../README.md) / EIP4844BlobTxReceipt

# Interface: EIP4844BlobTxReceipt

Defined in: packages/vm/types/utils/EIP4844BlobTxReceipt.d.ts:19

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

### bitvector

> **bitvector**: `Uint8Array`

Defined in: packages/vm/types/utils/BaseTxReceipt.d.ts:13

Bloom bitvector

#### Inherited from

[`PostByzantiumTxReceipt`](PostByzantiumTxReceipt.md).[`bitvector`](PostByzantiumTxReceipt.md#bitvector)

***

### blobGasPrice

> **blobGasPrice**: `bigint`

Defined in: packages/vm/types/utils/EIP4844BlobTxReceipt.d.ts:33

blob gas price for block transaction was included in

Note: This valus is not included in the `receiptRLP` used for encoding the `receiptsRoot` in a block
and is only provided as part of receipt metadata.

***

### blobGasUsed

> **blobGasUsed**: `bigint`

Defined in: packages/vm/types/utils/EIP4844BlobTxReceipt.d.ts:26

blob gas consumed by a transaction

Note: This value is not included in the receiptRLP used for encoding the receiptsRoot in a block
and is only provided as part of receipt metadata.

***

### cumulativeBlockGasUsed

> **cumulativeBlockGasUsed**: `bigint`

Defined in: packages/vm/types/utils/BaseTxReceipt.d.ts:9

Cumulative gas used in the block including this tx

#### Inherited from

[`PostByzantiumTxReceipt`](PostByzantiumTxReceipt.md).[`cumulativeBlockGasUsed`](PostByzantiumTxReceipt.md#cumulativeblockgasused)

***

### logs

> **logs**: [`Log`](../../evm/type-aliases/Log.md)[]

Defined in: packages/vm/types/utils/BaseTxReceipt.d.ts:17

Logs emitted

#### Inherited from

[`PostByzantiumTxReceipt`](PostByzantiumTxReceipt.md).[`logs`](PostByzantiumTxReceipt.md#logs)

***

### status

> **status**: `0` \| `1`

Defined in: packages/vm/types/utils/PostByzantiumTxReceipt.d.ts:10

Status of transaction, `1` if successful, `0` if an exception occurred

#### Inherited from

[`PostByzantiumTxReceipt`](PostByzantiumTxReceipt.md).[`status`](PostByzantiumTxReceipt.md#status)
