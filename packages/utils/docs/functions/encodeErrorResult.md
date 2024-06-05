[**@tevm/utils**](../README.md) • **Docs**

***

[@tevm/utils](../globals.md) / encodeErrorResult

# Function: encodeErrorResult()

> **encodeErrorResult**\<`abi`, `errorName`\>(`parameters`): `EncodeErrorResultReturnType`

## Type parameters

• **abi** *extends* `Abi` \| readonly `unknown`[]

• **errorName** *extends* `undefined` \| `string` = `undefined`

## Parameters

• **parameters**: `EncodeErrorResultParameters`\<`abi`, `errorName`, `abi` *extends* `Abi` ? `Abi` *extends* `abi`\<`abi`\> ? `true` : [`Extract`\<`abi`\<`abi`\>\[`number`\], `object`\>] *extends* [`never`] ? `false` : `true` : `true`, `ContractErrorArgs`\<`abi`, `errorName` *extends* `ContractErrorName`\<`abi`\> ? `errorName`\<`errorName`\> : `ContractErrorName`\<`abi`\>\>, `ContractErrorName`\<`abi`\>\>

## Returns

`EncodeErrorResultReturnType`

## Source

node\_modules/.pnpm/viem@2.13.6\_typescript@5.4.5\_zod@3.23.8/node\_modules/viem/\_types/utils/abi/encodeErrorResult.d.ts:23
