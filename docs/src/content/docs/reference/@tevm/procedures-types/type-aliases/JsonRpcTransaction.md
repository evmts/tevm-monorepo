---
editUrl: false
next: false
prev: false
title: "JsonRpcTransaction"
---

> **JsonRpcTransaction**: `object`

the transaction call object for methods like `eth_call`

## Type declaration

### data

> **data**?: `Hex`

The hash of the method signature and encoded parameters. For more information, see the Contract ABI description in the Solidity documentation

### from

> **from**: `Address`

The address from which the transaction is sent

### gas

> **gas**?: `Hex`

The integer of gas provided for the transaction execution

### gasPrice

> **gasPrice**?: `Hex`

The integer of gasPrice used for each paid gas encoded as hexadecimal

### to

> **to**?: `Address`

The address to which the transaction is addressed

### value

> **value**?: `Hex`

The integer of value sent with this transaction encoded as hexadecimal

## Source

[requests/EthJsonRpcRequest.ts:9](https://github.com/evmts/tevm-monorepo/blob/main/packages/procedures-types/src/requests/EthJsonRpcRequest.ts#L9)

***
Generated using [typedoc-plugin-markdown](https://www.npmjs.com/package/typedoc-plugin-markdown) and [TypeDoc](https://typedoc.org/)
