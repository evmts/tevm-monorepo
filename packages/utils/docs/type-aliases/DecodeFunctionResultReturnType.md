[**@tevm/utils**](../README.md)

***

[@tevm/utils](../globals.md) / DecodeFunctionResultReturnType

# Type Alias: DecodeFunctionResultReturnType\<abi, functionName, args\>

> **DecodeFunctionResultReturnType**\<`abi`, `functionName`, `args`\> = `ContractFunctionReturnType`\<`abi`, `AbiStateMutability`, `functionName` *extends* [`ContractFunctionName`](ContractFunctionName.md)\<`abi`\> ? `functionName` : [`ContractFunctionName`](ContractFunctionName.md)\<`abi`\>, `args`\>

Defined in: node\_modules/.pnpm/viem@2.37.8\_bufferutil@4.0.9\_typescript@5.8.3\_utf-8-validate@5.0.10\_zod@3.25.30/node\_modules/viem/\_types/utils/abi/decodeFunctionResult.d.ts:23

## Type Parameters

### abi

`abi` *extends* [`Abi`](Abi.md) \| readonly `unknown`[] = [`Abi`](Abi.md)

### functionName

`functionName` *extends* [`ContractFunctionName`](ContractFunctionName.md)\<`abi`\> \| `undefined` = [`ContractFunctionName`](ContractFunctionName.md)\<`abi`\>

### args

`args` *extends* `ContractFunctionArgs`\<`abi`, `AbiStateMutability`, `functionName` *extends* [`ContractFunctionName`](ContractFunctionName.md)\<`abi`\> ? `functionName` : [`ContractFunctionName`](ContractFunctionName.md)\<`abi`\>\> = `ContractFunctionArgs`\<`abi`, `AbiStateMutability`, `functionName` *extends* [`ContractFunctionName`](ContractFunctionName.md)\<`abi`\> ? `functionName` : [`ContractFunctionName`](ContractFunctionName.md)\<`abi`\>\>
