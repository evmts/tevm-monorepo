[**@tevm/utils**](../README.md)

***

[@tevm/utils](../globals.md) / serializeTransaction

# Function: serializeTransaction()

> **serializeTransaction**\<`transaction`, `_transactionType`\>(`transaction`, `signature`?): `TransactionSerialized`\<`_transactionType`, `_transactionType` *extends* `"eip1559"` ? `` `0x02${string}` `` : `never` \| `_transactionType` *extends* `"eip2930"` ? `` `0x01${string}` `` : `never` \| `_transactionType` *extends* `"eip4844"` ? `` `0x03${string}` `` : `never` \| `_transactionType` *extends* `"eip7702"` ? `` `0x04${string}` `` : `never` \| `_transactionType` *extends* `"legacy"` ? `TransactionSerializedLegacy` : `never`\>

Defined in: node\_modules/.pnpm/viem@2.23.10\_bufferutil@4.0.9\_typescript@5.8.2\_utf-8-validate@5.0.10\_zod@3.24.2/node\_modules/viem/\_types/utils/transaction/serializeTransaction.d.ts:20

## Type Parameters

### transaction

`transaction` *extends* `TransactionSerializable`

### _transactionType

`_transactionType` *extends* `TransactionType` = `GetTransactionType`\<`transaction`\>

## Parameters

### transaction

`transaction`

### signature?

`Signature`

## Returns

`TransactionSerialized`\<`_transactionType`, `_transactionType` *extends* `"eip1559"` ? `` `0x02${string}` `` : `never` \| `_transactionType` *extends* `"eip2930"` ? `` `0x01${string}` `` : `never` \| `_transactionType` *extends* `"eip4844"` ? `` `0x03${string}` `` : `never` \| `_transactionType` *extends* `"eip7702"` ? `` `0x04${string}` `` : `never` \| `_transactionType` *extends* `"legacy"` ? `TransactionSerializedLegacy` : `never`\>
