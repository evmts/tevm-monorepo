---
editUrl: false
next: false
prev: false
title: "createImpersonatedTx"
---

> **createImpersonatedTx**(`txData`, `opts`?): [`ImpersonatedTx`](/reference/tevm/tx/interfaces/impersonatedtx/)

Creates an impersonated tx that wraps [FeeMarketEIP1559Transaction](../../../../../../../reference/tevm/tx/classes/feemarketeip1559transaction).
Wraps following methods
- 'isImpersonated'
- 'hash'
- 'isSigned'
- 'getSenderAddress'

## Parameters

• **txData**: `FeeMarketEIP1559TxData` & `object`

• **opts?**: [`TxOptions`](/reference/tevm/tx/interfaces/txoptions/)

## Returns

[`ImpersonatedTx`](/reference/tevm/tx/interfaces/impersonatedtx/)

## Throws

Error if the constructor for [FeeMarketEIP1559Transaction](../../../../../../../reference/tevm/tx/classes/feemarketeip1559transaction) throws

## Source

[packages/tx/src/createImpersonatedTx.js:21](https://github.com/evmts/tevm-monorepo/blob/main/packages/tx/src/createImpersonatedTx.js#L21)
