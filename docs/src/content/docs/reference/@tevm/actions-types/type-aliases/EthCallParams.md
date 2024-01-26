---
editUrl: false
next: false
prev: false
title: "EthCallParams"
---

> **EthCallParams**: `object`

Based on the JSON-RPC request for `eth_call` procedure

## Type declaration

### blockTag

> **blockTag**?: [`BlockParam`](/reference/tevm/actions-types/type-aliases/blockparam/)

The block number hash or block tag

### data

> **data**?: [`Hex`](/reference/tevm/actions-types/type-aliases/hex/)

The hash of the method signature and encoded parameters. For more information, see the Contract ABI description in the Solidity documentation
Defaults to zero data

### from

> **from**?: [`Address`](/reference/tevm/actions-types/type-aliases/address/)

The address from which the transaction is sent. Defaults to zero address

### gas

> **gas**?: `bigint`

The integer of gas provided for the transaction execution

### gasPrice

> **gasPrice**?: `bigint`

The integer of gasPrice used for each paid gas

### to

> **to**?: [`Address`](/reference/tevm/actions-types/type-aliases/address/)

The address to which the transaction is addressed. Defaults to zero address

### value

> **value**?: `bigint`

The integer of value sent with this transaction

## Source

[params/EthParams.ts:24](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions-types/src/params/EthParams.ts#L24)

***
Generated using [typedoc-plugin-markdown](https://www.npmjs.com/package/typedoc-plugin-markdown) and [TypeDoc](https://typedoc.org/)
