[**tevm**](../../README.md)

***

[tevm](../../modules.md) / [tx](../README.md) / createImpersonatedTx

# Function: createImpersonatedTx()

> **createImpersonatedTx**(`txData`, `opts?`): [`ImpersonatedTx`](../interfaces/ImpersonatedTx.md)

Creates an unsigned EIP-1559 transaction that behaves as if it were signed by
`impersonatedAddress`.

## Parameters

| Parameter | Type |
| ------ | ------ |
| `txData` | [`ImpersonatedTxData`](../type-aliases/ImpersonatedTxData.md) |
| `opts?` | [`TxOptions`](../interfaces/TxOptions.md) |

## Returns

[`ImpersonatedTx`](../interfaces/ImpersonatedTx.md)
