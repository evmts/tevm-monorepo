---
editUrl: false
next: false
prev: false
title: "definePrecompile"
---

> **definePrecompile**\<`TName`, `THumanReadableAbi`\>(`__namedParameters`): `Precompile`\<`TName`, `THumanReadableAbi`, `ReturnType`\<\<`TAddress`\>(`address`) => `Omit`\<[`Script`](/reference/tevm/contract/type-aliases/script/)\<`TName`, `THumanReadableAbi`\>, `"address"` \| `"events"` \| `"read"` \| `"write"`\> & `object`\>\>

## Type parameters

• **TName** *extends* `string`

• **THumanReadableAbi** *extends* readonly `string`[]

## Parameters

• **\_\_namedParameters**: `Pick`\<`Precompile`\<`TName`, `THumanReadableAbi`, `ReturnType`\<\<`TAddress`\>(`address`) => `Omit`\<[`Script`](/reference/tevm/contract/type-aliases/script/)\<`TName`, `THumanReadableAbi`\>, `"address"` \| `"events"` \| `"read"` \| `"write"`\> & `object`\>\>, `"contract"` \| `"call"`\>

## Returns

`Precompile`\<`TName`, `THumanReadableAbi`, `ReturnType`\<\<`TAddress`\>(`address`) => `Omit`\<[`Script`](/reference/tevm/contract/type-aliases/script/)\<`TName`, `THumanReadableAbi`\>, `"address"` \| `"events"` \| `"read"` \| `"write"`\> & `object`\>\>

## Source

[precompiles/src/definePrecompile.ts:4](https://github.com/evmts/tevm-monorepo/blob/main/packages/precompiles/src/definePrecompile.ts#L4)
