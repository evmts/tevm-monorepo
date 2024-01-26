---
editUrl: false
next: false
prev: false
title: "CallResult"
---

> **CallResult**\<`ErrorType`\>: `object`

Result of a Tevm VM Call method

## Type parameters

| Parameter | Default |
| :------ | :------ |
| `ErrorType` | [`CallError`](/reference/tevm/errors/type-aliases/callerror/) |

## Type declaration

### blobGasUsed

> **blobGasUsed**?: `bigint`

Amount of blob gas consumed by the transaction

### createdAddress

> **createdAddress**?: [`Address`](/reference/tevm/actions-types/type-aliases/address/)

Address of created account during transaction, if any

### createdAddresses

> **createdAddresses**?: `Set`\<[`Address`](/reference/tevm/actions-types/type-aliases/address/)\>

Map of addresses which were created (used in EIP 6780)

### errors

> **errors**?: `ErrorType`[]

Description of the exception, if any occurred

### executionGasUsed

> **executionGasUsed**: `bigint`

Amount of gas the code used to run

### gas

> **gas**?: `bigint`

Amount of gas left

### gasRefund

> **gasRefund**?: `bigint`

The gas refund counter as a uint256

### logs

> **logs**?: [`Log`](/reference/tevm/actions-types/type-aliases/log/)[]

Array of logs that the contract emitted

### rawData

> **rawData**: [`Hex`](/reference/tevm/actions-types/type-aliases/hex/)

Encoded return value from the contract as hex string

### selfdestruct

> **selfdestruct**?: `Set`\<[`Address`](/reference/tevm/actions-types/type-aliases/address/)\>

A set of accounts to selfdestruct

## Source

[result/CallResult.ts:7](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions-types/src/result/CallResult.ts#L7)

***
Generated using [typedoc-plugin-markdown](https://www.npmjs.com/package/typedoc-plugin-markdown) and [TypeDoc](https://typedoc.org/)
