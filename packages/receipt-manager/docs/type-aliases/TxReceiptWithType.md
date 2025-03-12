[**@tevm/receipt-manager**](../README.md)

***

[@tevm/receipt-manager](../globals.md) / TxReceiptWithType

# Type Alias: TxReceiptWithType

> **TxReceiptWithType**: `PreByzantiumTxReceiptWithType` \| `PostByzantiumTxReceiptWithType`

Defined in: [ReceiptManager.ts:95](https://github.com/evmts/tevm-monorepo/blob/main/packages/receipt-manager/src/ReceiptManager.ts#L95)

TxReceiptWithType extends TxReceipt to provide transaction type information
This is used when the receipt needs to include the transaction type (EIP-2718)
