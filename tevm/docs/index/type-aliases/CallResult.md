**tevm** ∙ [README](../../README.md) ∙ [API](../../API.md)

***

[API](../../API.md) > [index](../README.md) > CallResult

# Type alias: CallResult`<ErrorType>`

> **CallResult**\<`ErrorType`\>: `object`

Result of a Tevm VM Call method

## Type parameters

| Parameter | Default |
| :------ | :------ |
| `ErrorType` | [`CallError`](../../errors/type-aliases/CallError.md) |

## Type declaration

### blobGasUsed

> **blobGasUsed**?: `bigint`

Amount of blob gas consumed by the transaction

### createdAddress

> **createdAddress**?: `Address`

Address of created account during transaction, if any

### createdAddresses

> **createdAddresses**?: `Set`\<`Address`\>

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

> **logs**?: [`Log`](../../actions-types/type-aliases/Log.md)[]

Array of logs that the contract emitted

### rawData

> **rawData**: [`Hex`](Hex.md)

Encoded return value from the contract as hex string

### selfdestruct

> **selfdestruct**?: `Set`\<`Address`\>

A set of accounts to selfdestruct

## Source

packages/actions-types/types/result/CallResult.d.ts:8

***
Generated using [typedoc-plugin-markdown](https://www.npmjs.com/package/typedoc-plugin-markdown) and [TypeDoc](https://typedoc.org/)
