[**tevm**](../../README.md)

***

[tevm](../../modules.md) / [index](../README.md) / decodeFunctionResult

# Function: decodeFunctionResult()

> **decodeFunctionResult**\<`abi`, `functionName`, `args`\>(`parameters`): `ContractFunctionReturnType`\<`abi`, `AbiStateMutability`, `functionName` *extends* [`ContractFunctionName`](../type-aliases/ContractFunctionName.md)\<`abi`, `AbiStateMutability`\> ? `functionName`\<`functionName`\> : [`ContractFunctionName`](../type-aliases/ContractFunctionName.md)\<`abi`, `AbiStateMutability`\>\>

Defined in: node\_modules/.pnpm/viem@2.30.1\_bufferutil@4.0.9\_typescript@5.8.3\_utf-8-validate@5.0.10\_zod@3.25.28/node\_modules/viem/\_types/utils/abi/decodeFunctionResult.d.ts:25

## Type Parameters

### abi

`abi` *extends* readonly `unknown`[] \| [`Abi`](../type-aliases/Abi.md)

### functionName

`functionName` *extends* `undefined` \| `string` = `undefined`

### args

`args` *extends* `unknown` = `ContractFunctionArgs`\<`abi`, `AbiStateMutability`, `functionName` *extends* [`ContractFunctionName`](../type-aliases/ContractFunctionName.md)\<`abi`\> ? `functionName`\<`functionName`\> : [`ContractFunctionName`](../type-aliases/ContractFunctionName.md)\<`abi`\>\>

## Parameters

### parameters

`DecodeFunctionResultParameters`\<`abi`, `functionName`, `args`\>

## Returns

`ContractFunctionReturnType`\<`abi`, `AbiStateMutability`, `functionName` *extends* [`ContractFunctionName`](../type-aliases/ContractFunctionName.md)\<`abi`, `AbiStateMutability`\> ? `functionName`\<`functionName`\> : [`ContractFunctionName`](../type-aliases/ContractFunctionName.md)\<`abi`, `AbiStateMutability`\>\>
