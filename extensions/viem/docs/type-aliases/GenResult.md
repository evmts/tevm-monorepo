[**@tevm/viem**](../README.md)

***

[@tevm/viem](../globals.md) / GenResult

# Type Alias: GenResult\<TDataType, TTag\>

> **GenResult**\<`TDataType`, `TTag`\>: `object`

Defined in: [extensions/viem/src/GenResult.ts:7](https://github.com/evmts/tevm-monorepo/blob/main/extensions/viem/src/GenResult.ts#L7)

**`Experimental`**

A result type for a single yield of writeContractOptimistic

## Type Parameters

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
