[**@tevm/tx**](../README.md) • **Docs**

***

[@tevm/tx](../globals.md) / createImpersonatedTx

# Function: createImpersonatedTx()

> **createImpersonatedTx**(`txData`, `opts`?): [`ImpersonatedTx`](../interfaces/ImpersonatedTx.md)

Creates an impersonated tx that wraps [FeeMarketEIP1559Transaction](../classes/FeeMarketEIP1559Transaction.md).
Wraps following methods
- 'isImpersonated'
- 'hash'
- 'isSigned'
- 'getSenderAddress'

## Parameters

• **txData**: `FeeMarketEIP1559TxData` & `object`

• **opts?**: [`TxOptions`](../interfaces/TxOptions.md)

## Returns

[`ImpersonatedTx`](../interfaces/ImpersonatedTx.md)

## Throws

Error if the constructor for [FeeMarketEIP1559Transaction](../classes/FeeMarketEIP1559Transaction.md) throws

## Defined in

[packages/tx/src/createImpersonatedTx.js:21](https://github.com/evmts/tevm-monorepo/blob/main/packages/tx/src/createImpersonatedTx.js#L21)
