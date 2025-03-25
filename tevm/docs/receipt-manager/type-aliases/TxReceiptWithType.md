[**tevm**](../../README.md)

***

[tevm](../../modules.md) / [receipt-manager](../README.md) / TxReceiptWithType

# Type Alias: TxReceiptWithType

> **TxReceiptWithType** = `PreByzantiumTxReceiptWithType` \| `PostByzantiumTxReceiptWithType`

Defined in: packages/receipt-manager/types/ReceiptManager.d.ts:80

TxReceiptWithType extends TxReceipt to provide transaction type information
This is used when the receipt needs to include the transaction type (EIP-2718)
