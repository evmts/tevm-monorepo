[**@tevm/utils**](../README.md)

***

[@tevm/utils](../globals.md) / decodeFunctionResult

# Function: decodeFunctionResult()

> **decodeFunctionResult**\<`abi`, `functionName`, `args`\>(`parameters`): `ContractFunctionReturnType`\<`abi`, `AbiStateMutability`, `functionName` *extends* [`ContractFunctionName`](../type-aliases/ContractFunctionName.md)\<`abi`, `AbiStateMutability`\> ? `functionName` : [`ContractFunctionName`](../type-aliases/ContractFunctionName.md)\<`abi`, `AbiStateMutability`\>\>

Defined in: tevm-monorepo/node\_modules/.pnpm/viem@2.49.3\_bufferutil@4.1.0\_typescript@6.0.3\_utf-8-validate@5.0.10\_zod@4.4.3/node\_modules/viem/\_types/utils/abi/decodeFunctionResult.d.ts:25

## Type Parameters

### abi

`abi` *extends* readonly `unknown`[] \| [`Abi`](../type-aliases/Abi.md)

### functionName

`functionName` *extends* `string` \| `undefined` = `undefined`

### args

`args` *extends* `unknown` = `ContractFunctionArgs`\<`abi`, `AbiStateMutability`, `functionName` *extends* [`ContractFunctionName`](../type-aliases/ContractFunctionName.md)\<`abi`\> ? `functionName` : [`ContractFunctionName`](../type-aliases/ContractFunctionName.md)\<`abi`\>\>

## Parameters

### parameters

`DecodeFunctionResultParameters`\<`abi`, `functionName`, `args`\>

## Returns

`ContractFunctionReturnType`\<`abi`, `AbiStateMutability`, `functionName` *extends* [`ContractFunctionName`](../type-aliases/ContractFunctionName.md)\<`abi`, `AbiStateMutability`\> ? `functionName` : [`ContractFunctionName`](../type-aliases/ContractFunctionName.md)\<`abi`, `AbiStateMutability`\>\>
