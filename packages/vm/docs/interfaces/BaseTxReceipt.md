[**@tevm/vm**](../README.md)

***

[@tevm/vm](../globals.md) / BaseTxReceipt

# Interface: BaseTxReceipt

Defined in: [packages/vm/src/utils/BaseTxReceipt.ts:6](https://github.com/evmts/tevm-monorepo/blob/main/packages/vm/src/utils/BaseTxReceipt.ts#L6)

Abstract interface with common transaction receipt fields

## Extended by

- [`PostByzantiumTxReceipt`](PostByzantiumTxReceipt.md)
- [`PreByzantiumTxReceipt`](PreByzantiumTxReceipt.md)

## Properties

| Property | Type | Description | Defined in |
| ------ | ------ | ------ | ------ |
| <a id="bitvector"></a> `bitvector` | `Uint8Array` | Bloom bitvector | [packages/vm/src/utils/BaseTxReceipt.ts:14](https://github.com/evmts/tevm-monorepo/blob/main/packages/vm/src/utils/BaseTxReceipt.ts#L14) |
| <a id="cumulativeblockgasused"></a> `cumulativeBlockGasUsed` | `bigint` | Cumulative gas used in the block including this tx | [packages/vm/src/utils/BaseTxReceipt.ts:10](https://github.com/evmts/tevm-monorepo/blob/main/packages/vm/src/utils/BaseTxReceipt.ts#L10) |
| <a id="logs"></a> `logs` | `ReceiptLog`[] | Logs emitted | [packages/vm/src/utils/BaseTxReceipt.ts:18](https://github.com/evmts/tevm-monorepo/blob/main/packages/vm/src/utils/BaseTxReceipt.ts#L18) |
