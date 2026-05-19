[**@tevm/receipt-manager**](../README.md)

***

[@tevm/receipt-manager](../globals.md) / TxReceiptWithType

# Type Alias: TxReceiptWithType

> **TxReceiptWithType** = `PreByzantiumTxReceiptWithType` \| `PostByzantiumTxReceiptWithType`

Defined in: [tevm-monorepo/packages/receipt-manager/src/ReceiptManager.ts:100](https://github.com/evmts/tevm-monorepo/blob/main/packages/receipt-manager/src/ReceiptManager.ts#L100)

TxReceiptWithType extends TxReceipt to provide transaction type information
This is used when the receipt needs to include the transaction type (EIP-2718)
