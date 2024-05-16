[**@tevm/viem**](../README.md) • **Docs**

***

[@tevm/viem](../globals.md) / GenError

# Type alias: GenError\<TErrorType, TTag\>

> **GenError**\<`TErrorType`, `TTag`\>: `object`

An error yield of writeContractOptimistic
Errors are yielded rather than throwing

## Type parameters

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

## Source

[extensions/viem/src/GenError.ts:7](https://github.com/evmts/tevm-monorepo/blob/main/extensions/viem/src/GenError.ts#L7)
