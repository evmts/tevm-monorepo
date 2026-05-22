[**@tevm/viem**](../README.md)

***

[@tevm/viem](../globals.md) / GenError

# Type Alias: GenError\<TErrorType, TTag\>

> **GenError**\<`TErrorType`, `TTag`\> = `object`

Defined in: [extensions/viem/src/GenError.ts:7](https://github.com/evmts/tevm-monorepo/blob/main/extensions/viem/src/GenError.ts#L7)

An error yield of writeContractOptimistic
Errors are yielded rather than throwing

## Type Parameters

| Type Parameter |
| ------ |
| `TErrorType` |
| `TTag` *extends* `string` |

## Properties

| Property | Type | Defined in |
| ------ | ------ | ------ |
| <a id="error"></a> `error` | `TErrorType` | [extensions/viem/src/GenError.ts:9](https://github.com/evmts/tevm-monorepo/blob/main/extensions/viem/src/GenError.ts#L9) |
| <a id="errors"></a> `errors?` | `ReadonlyArray`\<[`TypedError`](TypedError.md)\<`string`\>\> | [extensions/viem/src/GenError.ts:8](https://github.com/evmts/tevm-monorepo/blob/main/extensions/viem/src/GenError.ts#L8) |
| <a id="success"></a> `success` | `false` | [extensions/viem/src/GenError.ts:10](https://github.com/evmts/tevm-monorepo/blob/main/extensions/viem/src/GenError.ts#L10) |
| <a id="tag"></a> `tag` | `TTag` | [extensions/viem/src/GenError.ts:11](https://github.com/evmts/tevm-monorepo/blob/main/extensions/viem/src/GenError.ts#L11) |
