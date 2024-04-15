**@tevm/utils** ∙ [README](../README.md) ∙ [API](../API.md)

***

[API](../API.md) > encodeErrorResult

# Function: encodeErrorResult()

> **encodeErrorResult**\<`abi`, `errorName`\>(`parameters`): `EncodeErrorResultReturnType`

## Type parameters

▪ **abi** extends readonly `unknown`[] \| `Abi`

▪ **errorName** extends `undefined` \| `string` = `undefined`

## Parameters

▪ **parameters**: `EncodeErrorResultParameters`\<`abi`, `errorName`, `abi` extends `Abi` ? `Abi` extends `abi`\<`abi`\> ? `true` : [`Extract`\<`abi`\<`abi`\>[`number`], `object`\>] extends [`never`] ? `false` : `true` : `true`, `ContractErrorArgs`\<`abi`, `errorName` extends `ContractErrorName`\<`abi`\> ? `errorName`\<`errorName`\> : `ContractErrorName`\<`abi`\>\>, `ContractErrorName`\<`abi`\>\>

## Source

node\_modules/.pnpm/viem@2.8.18\_typescript@5.4.5\_zod@3.22.4/node\_modules/viem/\_types/utils/abi/encodeErrorResult.d.ts:23

***
Generated using [typedoc-plugin-markdown](https://www.npmjs.com/package/typedoc-plugin-markdown) and [TypeDoc](https://typedoc.org/)
