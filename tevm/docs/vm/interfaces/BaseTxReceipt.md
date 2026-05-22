[**tevm**](../../README.md)

***

[tevm](../../modules.md) / [vm](../README.md) / BaseTxReceipt

# Interface: BaseTxReceipt

Abstract interface with common transaction receipt fields

## Extended by

- [`PostByzantiumTxReceipt`](PostByzantiumTxReceipt.md)
- [`PreByzantiumTxReceipt`](PreByzantiumTxReceipt.md)

## Properties

| Property | Type | Description |
| ------ | ------ | ------ |
| <a id="bitvector"></a> `bitvector` | `Uint8Array` | Bloom bitvector |
| <a id="cumulativeblockgasused"></a> `cumulativeBlockGasUsed` | `bigint` | Cumulative gas used in the block including this tx |
| <a id="logs"></a> `logs` | [`EthjsLog`](../../utils/type-aliases/EthjsLog.md)[] | Logs emitted |
