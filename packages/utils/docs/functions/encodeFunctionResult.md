**@tevm/utils** • [Readme](../README.md) \| [API](../globals.md)

***

[@tevm/utils](../README.md) / encodeFunctionResult

# Function: encodeFunctionResult()

> **encodeFunctionResult**\<`abi`, `functionName`\>(`parameters`): `EncodeFunctionResultReturnType`

## Type parameters

• **abi** extends readonly `unknown`[] \| `Abi`

• **functionName** extends `undefined` \| `string` = `undefined`

## Parameters

• **parameters**: `EncodeFunctionResultParameters`\<`abi`, `functionName`, `abi` extends `Abi` ? `Abi` extends `abi`\<`abi`\> ? `true` : [`Extract`\<`abi`\<`abi`\>\[`number`\], `object`\>] extends [`never`] ? `false` : `true` : `true`, [`ContractFunctionName`](../type-aliases/ContractFunctionName.md)\<`abi`, `AbiStateMutability`\>\>

## Returns

`EncodeFunctionResultReturnType`

## Source

node\_modules/.pnpm/viem@2.8.18\_typescript@5.4.5/node\_modules/viem/\_types/utils/abi/encodeFunctionResult.d.ts:21
