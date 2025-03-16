[**@tevm/vm**](../README.md)

***

[@tevm/vm](../globals.md) / EIP4844BlobTxReceipt

# Interface: EIP4844BlobTxReceipt

Defined in: [packages/vm/src/utils/EIP4844BlobTxReceipt.ts:14](https://github.com/evmts/tevm-monorepo/blob/main/packages/vm/src/utils/EIP4844BlobTxReceipt.ts#L14)

[Description of what this interface represents]

## Example

```typescript
import { EIP4844BlobTxReceipt } from '[package-path]'

const value: EIP4844BlobTxReceipt = {
  // Initialize properties
}
```

## Extends

- [`PostByzantiumTxReceipt`](PostByzantiumTxReceipt.md)

## Properties

### bitvector

> **bitvector**: `Uint8Array`

Defined in: [packages/vm/src/utils/BaseTxReceipt.ts:14](https://github.com/evmts/tevm-monorepo/blob/main/packages/vm/src/utils/BaseTxReceipt.ts#L14)

Bloom bitvector

#### Inherited from

[`PostByzantiumTxReceipt`](PostByzantiumTxReceipt.md).[`bitvector`](PostByzantiumTxReceipt.md#bitvector)

***

### blobGasPrice

> **blobGasPrice**: `bigint`

Defined in: [packages/vm/src/utils/EIP4844BlobTxReceipt.ts:28](https://github.com/evmts/tevm-monorepo/blob/main/packages/vm/src/utils/EIP4844BlobTxReceipt.ts#L28)

blob gas price for block transaction was included in

Note: This valus is not included in the `receiptRLP` used for encoding the `receiptsRoot` in a block
and is only provided as part of receipt metadata.

***

### blobGasUsed

> **blobGasUsed**: `bigint`

Defined in: [packages/vm/src/utils/EIP4844BlobTxReceipt.ts:21](https://github.com/evmts/tevm-monorepo/blob/main/packages/vm/src/utils/EIP4844BlobTxReceipt.ts#L21)

blob gas consumed by a transaction

Note: This value is not included in the receiptRLP used for encoding the receiptsRoot in a block
and is only provided as part of receipt metadata.

***

### cumulativeBlockGasUsed

> **cumulativeBlockGasUsed**: `bigint`

Defined in: [packages/vm/src/utils/BaseTxReceipt.ts:10](https://github.com/evmts/tevm-monorepo/blob/main/packages/vm/src/utils/BaseTxReceipt.ts#L10)

Cumulative gas used in the block including this tx

#### Inherited from

[`PostByzantiumTxReceipt`](PostByzantiumTxReceipt.md).[`cumulativeBlockGasUsed`](PostByzantiumTxReceipt.md#cumulativeblockgasused)

***

### logs

> **logs**: `Log`[]

Defined in: [packages/vm/src/utils/BaseTxReceipt.ts:18](https://github.com/evmts/tevm-monorepo/blob/main/packages/vm/src/utils/BaseTxReceipt.ts#L18)

Logs emitted

#### Inherited from

[`PostByzantiumTxReceipt`](PostByzantiumTxReceipt.md).[`logs`](PostByzantiumTxReceipt.md#logs)

***

### status

> **status**: `0` \| `1`

Defined in: [packages/vm/src/utils/PostByzantiumTxReceipt.ts:11](https://github.com/evmts/tevm-monorepo/blob/main/packages/vm/src/utils/PostByzantiumTxReceipt.ts#L11)

Status of transaction, `1` if successful, `0` if an exception occurred

#### Inherited from

[`PostByzantiumTxReceipt`](PostByzantiumTxReceipt.md).[`status`](PostByzantiumTxReceipt.md#status)
