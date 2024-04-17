**@tevm/precompiles** • [Readme](../README.md) \| [API](../globals.md)

***

[@tevm/precompiles](../README.md) / definePrecompile

# Function: definePrecompile()

> **definePrecompile**\<`TName`, `THumanReadableAbi`\>(`__namedParameters`): `Precompile`\<`TName`, `THumanReadableAbi`, `ReturnType`\<\<`TAddress`\>(`address`) => `Omit`\<`Script`\<`TName`, `THumanReadableAbi`\>, `"address"` \| `"events"` \| `"read"` \| `"write"`\> & `object`\>\>

## Type parameters

• **TName** extends `string`

• **THumanReadableAbi** extends readonly `string`[]

## Parameters

• **\_\_namedParameters**: `Pick`\<`Precompile`\<`TName`, `THumanReadableAbi`, `ReturnType`\<\<`TAddress`\>(`address`) => `Omit`\<`Script`\<`TName`, `THumanReadableAbi`\>, `"address"` \| `"events"` \| `"read"` \| `"write"`\> & `object`\>\>, `"contract"` \| `"call"`\>

## Returns

`Precompile`\<`TName`, `THumanReadableAbi`, `ReturnType`\<\<`TAddress`\>(`address`) => `Omit`\<`Script`\<`TName`, `THumanReadableAbi`\>, `"address"` \| `"events"` \| `"read"` \| `"write"`\> & `object`\>\>

## Source

[precompiles/src/definePrecompile.ts:4](https://github.com/evmts/tevm-monorepo/blob/main/packages/precompiles/src/definePrecompile.ts#L4)
