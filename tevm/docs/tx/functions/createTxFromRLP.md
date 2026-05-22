[**tevm**](../../README.md)

***

[tevm](../../modules.md) / [tx](../README.md) / createTxFromRLP

# Function: createTxFromRLP()

> **createTxFromRLP**\<`T`\>(`data`, `txOptions?`): `Transaction`\[`T`\]

This method tries to decode serialized data.

## Type Parameters

| Type Parameter |
| ------ |
| `T` *extends* [`TransactionType`](../type-aliases/TransactionType.md) |

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `data` | `Uint8Array` | The data Uint8Array |
| `txOptions?` | [`TxOptions`](../interfaces/TxOptions.md) | The transaction options |

## Returns

`Transaction`\[`T`\]
