[**@tevm/tx**](../README.md)

***

[@tevm/tx](../globals.md) / createImpersonatedTx

# Function: createImpersonatedTx()

> **createImpersonatedTx**(`txData`, `opts?`): [`ImpersonatedTx`](../interfaces/ImpersonatedTx.md)

Defined in: zevm/npm/zevm/dist/tx.d.ts:26

Creates an unsigned EIP-1559 transaction that behaves as if it were signed by
`impersonatedAddress`.

## Parameters

### txData

[`ImpersonatedTxData`](../type-aliases/ImpersonatedTxData.md)

### opts?

[`TxOptions`](../interfaces/TxOptions.md)

## Returns

[`ImpersonatedTx`](../interfaces/ImpersonatedTx.md)
