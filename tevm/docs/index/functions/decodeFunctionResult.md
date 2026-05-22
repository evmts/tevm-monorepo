[**tevm**](../../README.md)

***

[tevm](../../modules.md) / [index](../README.md) / decodeFunctionResult

# Function: decodeFunctionResult()

> **decodeFunctionResult**\<`abi`, `functionName`, `args`\>(`parameters`): `ContractFunctionReturnType`\<`abi`, `AbiStateMutability`, `functionName` *extends* [`ContractFunctionName`](../type-aliases/ContractFunctionName.md)\<`abi`, `AbiStateMutability`\> ? `functionName` : [`ContractFunctionName`](../type-aliases/ContractFunctionName.md)\<`abi`, `AbiStateMutability`\>\>

## Type Parameters

| Type Parameter | Default type |
| ------ | ------ |
| `abi` *extends* [`Abi`](../type-aliases/Abi.md) \| readonly `unknown`[] | - |
| `functionName` *extends* `string` \| `undefined` | `undefined` |
| `args` *extends* `unknown` | `ContractFunctionArgs`\<`abi`, `AbiStateMutability`, `functionName` *extends* [`ContractFunctionName`](../type-aliases/ContractFunctionName.md)\<`abi`\> ? `functionName` : [`ContractFunctionName`](../type-aliases/ContractFunctionName.md)\<`abi`\>\> |

## Parameters

| Parameter | Type |
| ------ | ------ |
| `parameters` | `DecodeFunctionResultParameters`\<`abi`, `functionName`, `args`\> |

## Returns

`ContractFunctionReturnType`\<`abi`, `AbiStateMutability`, `functionName` *extends* [`ContractFunctionName`](../type-aliases/ContractFunctionName.md)\<`abi`, `AbiStateMutability`\> ? `functionName` : [`ContractFunctionName`](../type-aliases/ContractFunctionName.md)\<`abi`, `AbiStateMutability`\>\>
