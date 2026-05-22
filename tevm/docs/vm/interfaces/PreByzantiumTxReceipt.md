[**tevm**](../../README.md)

***

[tevm](../../modules.md) / [vm](../README.md) / PreByzantiumTxReceipt

# Interface: PreByzantiumTxReceipt

Pre-Byzantium receipt type with a field
for the intermediary state root

## Extends

- [`BaseTxReceipt`](BaseTxReceipt.md)

## Properties

| Property | Type | Description | Inherited from |
| ------ | ------ | ------ | ------ |
| <a id="bitvector"></a> `bitvector` | `Uint8Array` | Bloom bitvector | [`BaseTxReceipt`](BaseTxReceipt.md).[`bitvector`](BaseTxReceipt.md#bitvector) |
| <a id="cumulativeblockgasused"></a> `cumulativeBlockGasUsed` | `bigint` | Cumulative gas used in the block including this tx | [`BaseTxReceipt`](BaseTxReceipt.md).[`cumulativeBlockGasUsed`](BaseTxReceipt.md#cumulativeblockgasused) |
| <a id="logs"></a> `logs` | [`EthjsLog`](../../utils/type-aliases/EthjsLog.md)[] | Logs emitted | [`BaseTxReceipt`](BaseTxReceipt.md).[`logs`](BaseTxReceipt.md#logs) |
| <a id="stateroot"></a> `stateRoot` | `Uint8Array` | Intermediary state root | - |
