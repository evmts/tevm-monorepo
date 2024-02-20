**tevm** ∙ [README](../../README.md) ∙ [API](../../API.md)

***

[API](../../API.md) > [index](../README.md) > encodeErrorResult

# Function: encodeErrorResult()

> **encodeErrorResult**\<`abi`, `errorName`\>(`parameters`): `EncodeErrorResultReturnType`

## Type parameters

▪ **abi** extends [`Abi`](../type-aliases/Abi.md) \| readonly `unknown`[]

▪ **errorName** extends `undefined` \| `string` = `undefined`

## Parameters

▪ **parameters**: `EncodeErrorResultParameters`\<`abi`, `errorName`, `abi` extends [`Abi`](../type-aliases/Abi.md) ? [`Abi`](../type-aliases/Abi.md) extends `abi` ? `true` : [`Extract`\<`abi`[`number`], `object`\>] extends [`never`] ? `false` : `true` : `true`, `ContractErrorArgs`\<`abi`, `errorName` extends `ContractErrorName`\<`abi`\> ? `errorName` : `ContractErrorName`\<`abi`\>\>, `ContractErrorName`\<`abi`\>\>

## Source

node\_modules/.pnpm/viem@2.7.9\_typescript@5.3.3\_zod@3.22.4/node\_modules/viem/\_types/utils/abi/encodeErrorResult.d.ts:23

***
Generated using [typedoc-plugin-markdown](https://www.npmjs.com/package/typedoc-plugin-markdown) and [TypeDoc](https://typedoc.org/)
