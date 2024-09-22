[**tevm**](../../README.md) • **Docs**

***

[tevm](../../modules.md) / [index](../README.md) / encodeFunctionResult

# Function: encodeFunctionResult()

> **encodeFunctionResult**\<`abi`, `functionName`\>(`parameters`): `EncodeFunctionResultReturnType`

## Type Parameters

• **abi** *extends* `Abi` \| readonly `unknown`[]

• **functionName** *extends* `undefined` \| `string` = `undefined`

## Parameters

• **parameters**: `EncodeFunctionResultParameters`\<`abi`, `functionName`, `abi` *extends* `Abi` ? `Abi` *extends* `abi`\<`abi`\> ? `true` : [`Extract`\<`abi`\<`abi`\>\[`number`\], `object`\>] *extends* [`never`] ? `false` : `true` : `true`, [`ContractFunctionName`](../type-aliases/ContractFunctionName.md)\<`abi`, `AbiStateMutability`\>\>

## Returns

`EncodeFunctionResultReturnType`

## Defined in

node\_modules/.pnpm/viem@2.21.1\_bufferutil@4.0.8\_typescript@5.5.4\_utf-8-validate@6.0.4\_zod@3.23.8/node\_modules/viem/\_types/utils/abi/encodeFunctionResult.d.ts:21
