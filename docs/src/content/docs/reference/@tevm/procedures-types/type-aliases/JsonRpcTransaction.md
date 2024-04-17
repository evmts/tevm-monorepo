---
editUrl: false
next: false
prev: false
title: "JsonRpcTransaction"
---

> **JsonRpcTransaction**: `object`

the transaction call object for methods like `eth_call`

## Type declaration

### data?

> **`optional`** **data**: [`Hex`](/reference/utils/type-aliases/hex/)

The hash of the method signature and encoded parameters. For more information, see the Contract ABI description in the Solidity documentation

### from

> **from**: [`Address`](/reference/utils/type-aliases/address/)

The address from which the transaction is sent

### gas?

> **`optional`** **gas**: [`Hex`](/reference/utils/type-aliases/hex/)

The integer of gas provided for the transaction execution

### gasPrice?

> **`optional`** **gasPrice**: [`Hex`](/reference/utils/type-aliases/hex/)

The integer of gasPrice used for each paid gas encoded as hexadecimal

### to?

> **`optional`** **to**: [`Address`](/reference/utils/type-aliases/address/)

The address to which the transaction is addressed

### value?

> **`optional`** **value**: [`Hex`](/reference/utils/type-aliases/hex/)

The integer of value sent with this transaction encoded as hexadecimal

## Source

[requests/EthJsonRpcRequest.ts:9](https://github.com/evmts/tevm-monorepo/blob/main/packages/procedures-types/src/requests/EthJsonRpcRequest.ts#L9)
