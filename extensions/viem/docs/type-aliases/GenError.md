[**@tevm/viem**](../README.md)

***

[@tevm/viem](../globals.md) / GenError

# Type Alias: GenError\<TErrorType, TTag\>

> **GenError**\<`TErrorType`, `TTag`\>: `object`

Defined in: [extensions/viem/src/GenError.ts:7](https://github.com/evmts/tevm-monorepo/blob/main/extensions/viem/src/GenError.ts#L7)

An error yield of writeContractOptimistic
Errors are yielded rather than throwing

## Type Parameters

• **TErrorType**

• **TTag** *extends* `string`

## Type declaration

### error

> **error**: `TErrorType`

### errors?

> `optional` **errors**: `ReadonlyArray`\<[`TypedError`](TypedError.md)\<`string`\>\>

### success

> **success**: `false`

### tag

> **tag**: `TTag`
