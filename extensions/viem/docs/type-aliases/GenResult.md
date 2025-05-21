[**@tevm/viem**](../README.md)

***

[@tevm/viem](../globals.md) / GenResult

# Type Alias: GenResult\<TDataType, TTag\>

> **GenResult**\<`TDataType`, `TTag`\> = `object`

Defined in: [extensions/viem/src/GenResult.ts:7](https://github.com/evmts/tevm-monorepo/blob/main/extensions/viem/src/GenResult.ts#L7)

**`Experimental`**

A result type for a single yield of writeContractOptimistic

## Type Parameters

### TDataType

`TDataType`

### TTag

`TTag` *extends* `string`

## Properties

### data

> **data**: `TDataType`

Defined in: [extensions/viem/src/GenResult.ts:10](https://github.com/evmts/tevm-monorepo/blob/main/extensions/viem/src/GenResult.ts#L10)

***

### errors?

> `optional` **errors**: `ReadonlyArray`\<[`TypedError`](TypedError.md)\<`string`\>\>

Defined in: [extensions/viem/src/GenResult.ts:11](https://github.com/evmts/tevm-monorepo/blob/main/extensions/viem/src/GenResult.ts#L11)

***

### success

> **success**: `true`

Defined in: [extensions/viem/src/GenResult.ts:8](https://github.com/evmts/tevm-monorepo/blob/main/extensions/viem/src/GenResult.ts#L8)

***

### tag

> **tag**: `TTag`

Defined in: [extensions/viem/src/GenResult.ts:9](https://github.com/evmts/tevm-monorepo/blob/main/extensions/viem/src/GenResult.ts#L9)
