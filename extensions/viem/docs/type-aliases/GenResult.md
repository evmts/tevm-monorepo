[**@tevm/viem**](../README.md) • **Docs**

***

[@tevm/viem](../globals.md) / GenResult

# Type alias: GenResult\<TDataType, TTag\>

`Experimental`

> **GenResult**\<`TDataType`, `TTag`\>: `object`

A result type for a single yield of writeContractOptimistic

## Type parameters

• **TDataType**

• **TTag** *extends* `string`

## Type declaration

### data

> **data**: `TDataType`

### errors?

> `optional` **errors**: `ReadonlyArray`\<[`TypedError`](TypedError.md)\<`string`\>\>

### success

> **success**: `true`

### tag

> **tag**: `TTag`

## Source

[extensions/viem/src/GenResult.ts:7](https://github.com/evmts/tevm-monorepo/blob/main/extensions/viem/src/GenResult.ts#L7)
