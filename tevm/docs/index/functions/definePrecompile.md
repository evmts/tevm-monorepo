**tevm** ∙ [README](../../README.md) ∙ [API](../../API.md)

***

[API](../../API.md) > [index](../README.md) > definePrecompile

# Function: definePrecompile()

> **definePrecompile**\<`TName`, `THumanReadableAbi`\>(`__namedParameters`): `Precompile`\<`TName`, `THumanReadableAbi`, `ReturnType`\<\<`TAddress`\>(`address`) => `Omit`\<[`Script`](../type-aliases/Script.md)\<`TName`, `THumanReadableAbi`\>, `"address"` \| `"events"` \| `"read"` \| `"write"`\> & `object`\>\>

## Type parameters

▪ **TName** extends `string`

▪ **THumanReadableAbi** extends readonly `string`[]

## Parameters

▪ **\_\_namedParameters**: `Pick`\<`Precompile`\<`TName`, `THumanReadableAbi`, `ReturnType`\<\<`TAddress`\>(`address`) => `Omit`\<[`Script`](../type-aliases/Script.md)\<`TName`, `THumanReadableAbi`\>, `"address"` \| `"events"` \| `"read"` \| `"write"`\> & `object`\>\>, `"contract"` \| `"call"`\>

## Source

packages/precompiles/dist/index.d.ts:98

***
Generated using [typedoc-plugin-markdown](https://www.npmjs.com/package/typedoc-plugin-markdown) and [TypeDoc](https://typedoc.org/)
