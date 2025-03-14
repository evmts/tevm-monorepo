[**tevm**](../../README.md)

***

[tevm](../../modules.md) / [index](../README.md) / decodeFunctionResult

# Function: decodeFunctionResult()

> **decodeFunctionResult**\<`abi`, `functionName`, `args`\>(`parameters`): `ContractFunctionReturnType`\<`abi`, `AbiStateMutability`, `functionName` *extends* [`ContractFunctionName`](../type-aliases/ContractFunctionName.md)\<`abi`, `AbiStateMutability`\> ? `functionName`\<`functionName`\> : [`ContractFunctionName`](../type-aliases/ContractFunctionName.md)\<`abi`, `AbiStateMutability`\>\>

Defined in: node\_modules/.pnpm/viem@2.23.10\_bufferutil@4.0.9\_typescript@5.8.2\_utf-8-validate@5.0.10\_zod@3.24.2/node\_modules/viem/\_types/utils/abi/decodeFunctionResult.d.ts:25

## Type Parameters

• **abi** *extends* [`Abi`](../type-aliases/Abi.md) \| readonly `unknown`[]

• **functionName** *extends* `undefined` \| `string` = `undefined`

• **args** *extends* `unknown` = `ContractFunctionArgs`\<`abi`, `AbiStateMutability`, `functionName` *extends* [`ContractFunctionName`](../type-aliases/ContractFunctionName.md)\<`abi`\> ? `functionName`\<`functionName`\> : [`ContractFunctionName`](../type-aliases/ContractFunctionName.md)\<`abi`\>\>

## Parameters

### parameters

`DecodeFunctionResultParameters`\<`abi`, `functionName`, `args`\>

## Returns

`ContractFunctionReturnType`\<`abi`, `AbiStateMutability`, `functionName` *extends* [`ContractFunctionName`](../type-aliases/ContractFunctionName.md)\<`abi`, `AbiStateMutability`\> ? `functionName`\<`functionName`\> : [`ContractFunctionName`](../type-aliases/ContractFunctionName.md)\<`abi`, `AbiStateMutability`\>\>
