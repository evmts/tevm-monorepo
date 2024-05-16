[**tevm**](../../README.md) • **Docs**

***

[tevm](../../modules.md) / [index](../README.md) / definePrecompile

# Function: definePrecompile()

> **definePrecompile**\<`TName`, `THumanReadableAbi`\>(`__namedParameters`): `Precompile`\<`TName`, `THumanReadableAbi`, `ReturnType`\<\<`TAddress`\>(`address`) => `Omit`\<[`Script`](../type-aliases/Script.md)\<`TName`, `THumanReadableAbi`\>, `"address"` \| `"events"` \| `"read"` \| `"write"`\> & `object`\>\>

## Type parameters

• **TName** *extends* `string`

• **THumanReadableAbi** *extends* readonly `string`[]

## Parameters

• **\_\_namedParameters**: `Pick`\<`Precompile`\<`TName`, `THumanReadableAbi`, `ReturnType`\<\<`TAddress`\>(`address`) => `Omit`\<[`Script`](../type-aliases/Script.md)\<`TName`, `THumanReadableAbi`\>, `"address"` \| `"events"` \| `"read"` \| `"write"`\> & `object`\>\>, `"contract"` \| `"call"`\>

## Returns

`Precompile`\<`TName`, `THumanReadableAbi`, `ReturnType`\<\<`TAddress`\>(`address`) => `Omit`\<[`Script`](../type-aliases/Script.md)\<`TName`, `THumanReadableAbi`\>, `"address"` \| `"events"` \| `"read"` \| `"write"`\> & `object`\>\>

## Source

packages/precompiles/dist/index.d.ts:95
