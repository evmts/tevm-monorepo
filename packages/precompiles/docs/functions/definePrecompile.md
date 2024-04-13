**@tevm/precompiles** ∙ [README](../README.md) ∙ [API](../API.md)

***

[API](../API.md) > definePrecompile

# Function: definePrecompile()

> **definePrecompile**\<`TName`, `THumanReadableAbi`\>(`__namedParameters`): `Precompile`\<`TName`, `THumanReadableAbi`, `ReturnType`\<\<`TAddress`\>(`address`) => `Omit`\<`Script`\<`TName`, `THumanReadableAbi`\>, `"events"` \| `"read"` \| `"write"` \| `"address"`\> & `object`\>\>

## Type parameters

▪ **TName** extends `string`

▪ **THumanReadableAbi** extends readonly `string`[]

## Parameters

▪ **\_\_namedParameters**: `Pick`\<`Precompile`\<`TName`, `THumanReadableAbi`, `ReturnType`\<\<`TAddress`\>(`address`) => `Omit`\<`Script`\<`TName`, `THumanReadableAbi`\>, `"events"` \| `"read"` \| `"write"` \| `"address"`\> & `object`\>\>, `"contract"` \| `"call"`\>

## Source

[precompiles/src/definePrecompile.ts:4](https://github.com/evmts/tevm-monorepo/blob/main/packages/precompiles/src/definePrecompile.ts#L4)

***
Generated using [typedoc-plugin-markdown](https://www.npmjs.com/package/typedoc-plugin-markdown) and [TypeDoc](https://typedoc.org/)
