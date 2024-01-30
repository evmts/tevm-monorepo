---
editUrl: false
next: false
prev: false
title: "EthSignTransactionParams"
---

> **EthSignTransactionParams**: `object`

Based on the JSON-RPC request for `eth_signTransaction` procedure

:::caution[Experimental]
This API should not be used in production and may be trimmed from a public release.
:::

## Type declaration

### data

> **data**?: [`Hex`](/reference/tevm/actions-types/type-aliases/hex/)

The compiled code of a contract OR the hash of the invoked method signature and encoded parameters.
Optional if creating a contract.

### from

> **from**: [`Address`](/reference/tevm/actions-types/type-aliases/address/)

The address from which the transaction is sent from

### gas

> **gas**?: `bigint`

The gas provded for transaction execution. It will return unused gas.
Default value is 90000

### gasPrice

> **gasPrice**?: `bigint`

Integer of the gasPrice used for each paid gas, in Wei.
If not provided tevm will default to the eth_gasPrice value

### nonce

> **nonce**?: `bigint`

Integer of a nonce. This allows to overwrite your own pending transactions that use the same nonce.

### to

> **to**?: [`Address`](/reference/tevm/actions-types/type-aliases/address/)

The address the transaction is directed to. Optional if
creating a contract

### value

> **value**?: `bigint`

Integer of the value sent with this transaction, in Wei.

## Source

[params/EthParams.ts:239](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions-types/src/params/EthParams.ts#L239)

***
Generated using [typedoc-plugin-markdown](https://www.npmjs.com/package/typedoc-plugin-markdown) and [TypeDoc](https://typedoc.org/)
