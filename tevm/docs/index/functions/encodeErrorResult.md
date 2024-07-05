[**tevm**](../../README.md) • **Docs**

***

[tevm](../../modules.md) / [index](../README.md) / encodeErrorResult

# Function: encodeErrorResult()

> **encodeErrorResult**\<`abi`, `errorName`\>(`parameters`): `EncodeErrorResultReturnType`

## Type Parameters

• **abi** *extends* `Abi` \| readonly `unknown`[]

• **errorName** *extends* `undefined` \| `string` = `undefined`

## Parameters

• **parameters**: `EncodeErrorResultParameters`\<`abi`, `errorName`, `abi` *extends* `Abi` ? `Abi` *extends* `abi`\<`abi`\> ? `true` : [`Extract`\<`abi`\<`abi`\>\[`number`\], `object`\>] *extends* [`never`] ? `false` : `true` : `true`, `ContractErrorArgs`\<`abi`, `errorName` *extends* `ContractErrorName`\<`abi`\> ? `errorName`\<`errorName`\> : `ContractErrorName`\<`abi`\>\>, `ContractErrorName`\<`abi`\>\>

## Returns

`EncodeErrorResultReturnType`

## Defined in

node\_modules/.pnpm/viem@2.14.2\_bufferutil@4.0.8\_typescript@5.5.3\_utf-8-validate@6.0.4\_zod@3.23.8/node\_modules/viem/\_types/utils/abi/encodeErrorResult.d.ts:23
