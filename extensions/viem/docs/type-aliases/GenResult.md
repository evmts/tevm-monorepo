[**@tevm/viem**](../README.md)

***

[@tevm/viem](../globals.md) / GenResult

# Type Alias: GenResult\<TDataType, TTag\>

> **GenResult**\<`TDataType`, `TTag`\> = `object`

Defined in: [extensions/viem/src/GenResult.ts:7](https://github.com/evmts/tevm-monorepo/blob/main/extensions/viem/src/GenResult.ts#L7)

**`Experimental`**

A result type for a single yield of writeContractOptimistic

## Type Parameters

| Type Parameter |
| ------ |
| `TDataType` |
| `TTag` *extends* `string` |

## Properties

| Property | Type | Defined in |
| ------ | ------ | ------ |
| <a id="data"></a> `data` | `TDataType` | [extensions/viem/src/GenResult.ts:10](https://github.com/evmts/tevm-monorepo/blob/main/extensions/viem/src/GenResult.ts#L10) |
| <a id="errors"></a> `errors?` | `ReadonlyArray`\<[`TypedError`](TypedError.md)\<`string`\>\> | [extensions/viem/src/GenResult.ts:11](https://github.com/evmts/tevm-monorepo/blob/main/extensions/viem/src/GenResult.ts#L11) |
| <a id="success"></a> `success` | `true` | [extensions/viem/src/GenResult.ts:8](https://github.com/evmts/tevm-monorepo/blob/main/extensions/viem/src/GenResult.ts#L8) |
| <a id="tag"></a> `tag` | `TTag` | [extensions/viem/src/GenResult.ts:9](https://github.com/evmts/tevm-monorepo/blob/main/extensions/viem/src/GenResult.ts#L9) |
