[**@tevm/viem**](../README.md)

***

[@tevm/viem](../globals.md) / GenError

# Type Alias: GenError\<TErrorType, TTag\>

> **GenError**\<`TErrorType`, `TTag`\> = `object`

Defined in: [extensions/viem/src/GenError.ts:7](https://github.com/evmts/tevm-monorepo/blob/main/extensions/viem/src/GenError.ts#L7)

An error yield of writeContractOptimistic
Errors are yielded rather than throwing

## Type Parameters

### TErrorType

`TErrorType`

### TTag

`TTag` *extends* `string`

## Properties

### error

> **error**: `TErrorType`

Defined in: [extensions/viem/src/GenError.ts:9](https://github.com/evmts/tevm-monorepo/blob/main/extensions/viem/src/GenError.ts#L9)

***

### errors?

> `optional` **errors**: `ReadonlyArray`\<[`TypedError`](TypedError.md)\<`string`\>\>

Defined in: [extensions/viem/src/GenError.ts:8](https://github.com/evmts/tevm-monorepo/blob/main/extensions/viem/src/GenError.ts#L8)

***

### success

> **success**: `false`

Defined in: [extensions/viem/src/GenError.ts:10](https://github.com/evmts/tevm-monorepo/blob/main/extensions/viem/src/GenError.ts#L10)

***

### tag

> **tag**: `TTag`

Defined in: [extensions/viem/src/GenError.ts:11](https://github.com/evmts/tevm-monorepo/blob/main/extensions/viem/src/GenError.ts#L11)
