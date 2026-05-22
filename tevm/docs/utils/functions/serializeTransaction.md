[**tevm**](../../README.md)

***

[tevm](../../modules.md) / [utils](../README.md) / serializeTransaction

# Function: serializeTransaction()

> **serializeTransaction**\<`transaction`, `_transactionType`\>(`transaction`, `signature?`): `TransactionSerialized`\<`_transactionType`, `_transactionType` *extends* `"eip1559"` ? `` `0x02${string}` `` : `never` \| `_transactionType` *extends* `"eip2930"` ? `` `0x01${string}` `` : `never` \| `_transactionType` *extends* `"eip4844"` ? `` `0x03${string}` `` : `never` \| `_transactionType` *extends* `"eip7702"` ? `` `0x04${string}` `` : `never` \| `_transactionType` *extends* `"legacy"` ? `TransactionSerializedLegacy` : `never`\>

## Type Parameters

| Type Parameter | Default type |
| ------ | ------ |
| `transaction` *extends* `TransactionSerializable` | - |
| `_transactionType` *extends* `TransactionType` | `GetTransactionType`\<`transaction`\> |

## Parameters

| Parameter | Type |
| ------ | ------ |
| `transaction` | `transaction` |
| `signature?` | `Signature` |

## Returns

`TransactionSerialized`\<`_transactionType`, `_transactionType` *extends* `"eip1559"` ? `` `0x02${string}` `` : `never` \| `_transactionType` *extends* `"eip2930"` ? `` `0x01${string}` `` : `never` \| `_transactionType` *extends* `"eip4844"` ? `` `0x03${string}` `` : `never` \| `_transactionType` *extends* `"eip7702"` ? `` `0x04${string}` `` : `never` \| `_transactionType` *extends* `"legacy"` ? `TransactionSerializedLegacy` : `never`\>
