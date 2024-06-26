[**@tevm/viem**](../README.md) • **Docs**

***

[@tevm/viem](../globals.md) / GenResult

# Type Alias: GenResult\<TDataType, TTag\>

> **GenResult**\<`TDataType`, `TTag`\>: `object`

**`Experimental`**

A result type for a single yield of writeContractOptimistic

## Type Parameters

• **TDataType**

• **TTag** *extends* `string`

## Type declaration

### data

> **data**: `TDataType`

**`Experimental`**

### errors?

> `optional` **errors**: `ReadonlyArray`\<[`TypedError`](TypedError.md)\<`string`\>\>

**`Experimental`**

### success

> **success**: `true`

**`Experimental`**

### tag

> **tag**: `TTag`

**`Experimental`**

## Defined in

[extensions/viem/src/GenResult.ts:7](https://github.com/evmts/tevm-monorepo/blob/main/extensions/viem/src/GenResult.ts#L7)
