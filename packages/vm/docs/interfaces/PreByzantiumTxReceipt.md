[**@tevm/vm**](../README.md)

***

[@tevm/vm](../globals.md) / PreByzantiumTxReceipt

# Interface: PreByzantiumTxReceipt

Defined in: [packages/vm/src/utils/PrebyzantiumTxReceipt.ts:7](https://github.com/evmts/tevm-monorepo/blob/main/packages/vm/src/utils/PrebyzantiumTxReceipt.ts#L7)

Pre-Byzantium receipt type with a field
for the intermediary state root

## Extends

- [`BaseTxReceipt`](BaseTxReceipt.md)

## Properties

| Property | Type | Description | Inherited from | Defined in |
| ------ | ------ | ------ | ------ | ------ |
| <a id="bitvector"></a> `bitvector` | `Uint8Array` | Bloom bitvector | [`BaseTxReceipt`](BaseTxReceipt.md).[`bitvector`](BaseTxReceipt.md#bitvector) | [packages/vm/src/utils/BaseTxReceipt.ts:14](https://github.com/evmts/tevm-monorepo/blob/main/packages/vm/src/utils/BaseTxReceipt.ts#L14) |
| <a id="cumulativeblockgasused"></a> `cumulativeBlockGasUsed` | `bigint` | Cumulative gas used in the block including this tx | [`BaseTxReceipt`](BaseTxReceipt.md).[`cumulativeBlockGasUsed`](BaseTxReceipt.md#cumulativeblockgasused) | [packages/vm/src/utils/BaseTxReceipt.ts:10](https://github.com/evmts/tevm-monorepo/blob/main/packages/vm/src/utils/BaseTxReceipt.ts#L10) |
| <a id="logs"></a> `logs` | `ReceiptLog`[] | Logs emitted | [`BaseTxReceipt`](BaseTxReceipt.md).[`logs`](BaseTxReceipt.md#logs) | [packages/vm/src/utils/BaseTxReceipt.ts:18](https://github.com/evmts/tevm-monorepo/blob/main/packages/vm/src/utils/BaseTxReceipt.ts#L18) |
| <a id="stateroot"></a> `stateRoot` | `Uint8Array` | Intermediary state root | - | [packages/vm/src/utils/PrebyzantiumTxReceipt.ts:11](https://github.com/evmts/tevm-monorepo/blob/main/packages/vm/src/utils/PrebyzantiumTxReceipt.ts#L11) |
