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

### data?

> `readonly` `optional` **data**: [`Hex`](/reference/tevm/actions/type-aliases/hex/)

The compiled code of a contract OR the hash of the invoked method signature and encoded parameters.
Optional if creating a contract.

:::caution[Experimental]
This API should not be used in production and may be trimmed from a public release.
:::

### from

> `readonly` **from**: [`Address`](/reference/tevm/actions/type-aliases/address/)

The address from which the transaction is sent from

:::caution[Experimental]
This API should not be used in production and may be trimmed from a public release.
:::

### gas?

> `readonly` `optional` **gas**: `bigint`

The gas provded for transaction execution. It will return unused gas.
Default value is 90000

:::caution[Experimental]
This API should not be used in production and may be trimmed from a public release.
:::

### gasPrice?

> `readonly` `optional` **gasPrice**: `bigint`

Integer of the gasPrice used for each paid gas, in Wei.
If not provided tevm will default to the eth_gasPrice value

:::caution[Experimental]
This API should not be used in production and may be trimmed from a public release.
:::

### nonce?

> `readonly` `optional` **nonce**: `bigint`

Integer of a nonce. This allows to overwrite your own pending transactions that use the same nonce.

:::caution[Experimental]
This API should not be used in production and may be trimmed from a public release.
:::

### to?

> `readonly` `optional` **to**: [`Address`](/reference/tevm/actions/type-aliases/address/)

The address the transaction is directed to. Optional if
creating a contract

:::caution[Experimental]
This API should not be used in production and may be trimmed from a public release.
:::

### value?

> `readonly` `optional` **value**: `bigint`

Integer of the value sent with this transaction, in Wei.

:::caution[Experimental]
This API should not be used in production and may be trimmed from a public release.
:::

## Defined in

[packages/actions/src/eth/EthParams.ts:249](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/eth/EthParams.ts#L249)
